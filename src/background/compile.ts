import type { AppState, HeaderRule, RedirectRule } from '../shared/types';

// chrome.declarativeNetRequest.Rule과 구조 호환. chrome 전역(런타임 enum)을
// 참조하지 않기 위해 자체 정의한다 — 이 파일은 node 환경 vitest에서 실행된다.
export type DnrRule = {
  id: number;
  priority: 1;
  action:
    | {
        type: 'modifyHeaders';
        requestHeaders?: Array<{
          header: string;
          operation: 'set';
          value: string;
        }>;
        responseHeaders?: Array<{
          header: string;
          operation: 'set';
          value: string;
        }>;
      }
    | { type: 'redirect'; redirect: { regexSubstitution: string } };
  condition: { regexFilter?: string; resourceTypes: string[] };
};

// 기본값 동작(문서상 모호)에 의존하지 않도록 전체 명시 (스펙 §DNR 컴파일 명세 3항)
const ALL_RESOURCE_TYPES = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'csp_report',
  'media',
  'websocket',
  'other',
];

// RFC 7230 token 문자셋
const HEADER_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+$/;

function isValidHeader(rule: HeaderRule): boolean {
  return HEADER_NAME_RE.test(rule.name);
}

function wildcardCount(pattern: string): number {
  return pattern.split('*').length - 1;
}

// match에 *가 하나도 없으면 뒤에 있는 것으로 친다 — 리다이렉트의 기본은 URL 치환이다
function effectiveMatch(match: string): string {
  return match.includes('*') ? match : `${match}*`;
}

function isValidRedirect(rule: RedirectRule): boolean {
  if (!rule.match || !rule.target) return false;
  return (
    wildcardCount(rule.target) <= wildcardCount(effectiveMatch(rule.match))
  );
}

function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toRegexFilter(match: string): string {
  return `^${effectiveMatch(match).split('*').map(escapeRegex).join('(.*)')}$`;
}

// target이 match의 마지막 캡처를 쓰지 않으면 끝에 이어붙인다 — 꼬리는 버리지 않는다
function toSubstitution(target: string, match: string): string {
  let group = 0;
  const substituted = target.replace(/\*/g, () => `\\${++group}`);
  const last = wildcardCount(effectiveMatch(match));
  return group < last ? `${substituted}\\${last}` : substituted;
}

export function compile(state: AppState): DnrRule[] {
  if (!state.globalEnabled) return [];
  const profile = state.profiles.find((p) => p.id === state.activeProfileId);
  if (!profile) return [];

  const rules: DnrRule[] = [];

  for (const rule of profile.headerRules) {
    if (!rule.enabled || !isValidHeader(rule)) continue;
    const headers = [
      { header: rule.name, operation: 'set' as const, value: rule.value },
    ];
    rules.push({
      id: rules.length + 1,
      priority: 1,
      action:
        rule.direction === 'request'
          ? { type: 'modifyHeaders', requestHeaders: headers }
          : { type: 'modifyHeaders', responseHeaders: headers },
      condition: { resourceTypes: ALL_RESOURCE_TYPES },
    });
  }

  for (const rule of profile.redirectRules) {
    if (!rule.enabled || !isValidRedirect(rule)) continue;
    rules.push({
      id: rules.length + 1,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          regexSubstitution: toSubstitution(rule.target, rule.match),
        },
      },
      condition: {
        regexFilter: toRegexFilter(rule.match),
        resourceTypes: ALL_RESOURCE_TYPES,
      },
    });
  }

  return rules;
}
