import { describe, expect, it } from 'vitest';
import { createDefaultProfile, createDefaultState } from '../shared/defaults';
import type { AppState, HeaderRule, RedirectRule } from '../shared/types';
import { compile } from './compile';

function header(over: Partial<HeaderRule> = {}): HeaderRule {
  return {
    id: 'h1',
    enabled: true,
    direction: 'request',
    name: 'X-Test',
    value: '1',
    ...over,
  };
}

function redirect(over: Partial<RedirectRule> = {}): RedirectRule {
  return {
    id: 'r1',
    enabled: true,
    match: 'https://api.example.com/*',
    target: 'http://localhost:8080/*',
    ...over,
  };
}

function stateWith(rules: {
  headerRules?: HeaderRule[];
  redirectRules?: RedirectRule[];
}): AppState {
  const state = createDefaultState();
  Object.assign(state.profiles[0], rules);
  return state;
}

describe('compile', () => {
  it('전역 토글이 꺼져 있으면 빈 배열을 돌려준다', () => {
    const state = stateWith({ headerRules: [header()] });
    state.globalEnabled = false;
    expect(compile(state)).toEqual([]);
  });

  it('비활성 룰은 제외한다', () => {
    const state = stateWith({ headerRules: [header({ enabled: false })] });
    expect(compile(state)).toEqual([]);
  });

  it('활성 프로필이 아닌 프로필의 룰은 무시한다', () => {
    const state = stateWith({ headerRules: [header()] });
    const other = createDefaultProfile('Other');
    other.headerRules = [header({ id: 'h2', name: 'X-Other' })];
    state.profiles.push(other);
    const rules = compile(state);
    expect(rules).toHaveLength(1);
  });

  it('request 헤더 룰을 modifyHeaders/requestHeaders set으로 매핑한다', () => {
    const rules = compile(
      stateWith({
        headerRules: [header({ name: 'X-Debug-Mode', value: 'true' })],
      }),
    );
    expect(rules).toEqual([
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'X-Debug-Mode', operation: 'set', value: 'true' },
          ],
        },
        condition: {
          resourceTypes: expect.arrayContaining([
            'main_frame',
            'xmlhttprequest',
          ]),
        },
      },
    ]);
  });

  it('response 헤더 룰은 responseHeaders로 매핑한다', () => {
    const rules = compile(
      stateWith({
        headerRules: [
          header({
            direction: 'response',
            name: 'Access-Control-Allow-Origin',
            value: '*',
          }),
        ],
      }),
    );
    expect(rules[0].action).toEqual({
      type: 'modifyHeaders',
      responseHeaders: [
        { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
      ],
    });
  });

  it('빈 이름·불법 문자 헤더는 제외한다', () => {
    const rules = compile(
      stateWith({
        headerRules: [
          header({ id: 'a', name: '' }),
          header({ id: 'b', name: 'X Space' }),
          header({ id: 'c', name: '한글' }),
          header({ id: 'd', name: 'X-Ok' }),
        ],
      }),
    );
    expect(rules).toHaveLength(1);
  });

  it('리다이렉트 룰을 regexFilter/regexSubstitution으로 변환한다', () => {
    const rules = compile(stateWith({ redirectRules: [redirect()] }));
    expect(rules[0].action).toEqual({
      type: 'redirect',
      redirect: { regexSubstitution: 'http://localhost:8080/\\1' },
    });
    expect(rules[0].condition.regexFilter).toBe(
      '^https://api\\.example\\.com/(.*)$',
    );
  });

  it('match의 regex 특수문자를 이스케이프한다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({
            match: 'https://a.com/x?y=1*',
            target: 'https://b.com/*',
          }),
        ],
      }),
    );
    expect(rules[0].condition.regexFilter).toBe(
      '^https://a\\.com/x\\?y=1(.*)$',
    );
  });

  it('다중 와일드카드는 순서대로 캡처·치환한다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({
            match: 'https://*.example.com/api/*',
            target: 'http://localhost/*/v2/*',
          }),
        ],
      }),
    );
    expect(rules[0].condition.regexFilter).toBe(
      '^https://(.*)\\.example\\.com/api/(.*)$',
    );
    expect(rules[0].action).toEqual({
      type: 'redirect',
      redirect: { regexSubstitution: 'http://localhost/\\1/v2/\\2' },
    });
  });

  it('match에 *가 없으면 뒤에 있는 것처럼 접두사로 매치하고 꼬리를 넘긴다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({
            match: 'https://api.example.com',
            target: 'http://localhost:8080',
          }),
        ],
      }),
    );
    expect(rules[0].condition.regexFilter).toBe(
      '^https://api\\.example\\.com(.*)$',
    );
    expect(rules[0].action).toEqual({
      type: 'redirect',
      redirect: { regexSubstitution: 'http://localhost:8080\\1' },
    });
  });

  it('target에 *가 없으면 match의 마지막 캡처를 끝에 이어붙인다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({
            match: 'https://a.com/*',
            target: 'http://localhost:8080',
          }),
        ],
      }),
    );
    expect(rules[0].action).toEqual({
      type: 'redirect',
      redirect: { regexSubstitution: 'http://localhost:8080\\1' },
    });
  });

  it('match에 *가 하나라도 있으면 암시적 와일드카드를 붙이지 않는다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({ match: 'https://*.a.com', target: 'http://localhost/*' }),
        ],
      }),
    );
    expect(rules[0].condition.regexFilter).toBe('^https://(.*)\\.a\\.com$');
  });

  it('target의 *가 match보다 많으면 제외한다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({ match: 'https://a.com/*', target: 'https://b.com/*/*' }),
        ],
      }),
    );
    expect(rules).toEqual([]);
  });

  it('match 또는 target이 비어 있으면 제외한다', () => {
    const rules = compile(
      stateWith({
        redirectRules: [
          redirect({ id: 'a', match: '' }),
          redirect({ id: 'b', target: '' }),
        ],
      }),
    );
    expect(rules).toEqual([]);
  });

  it('규칙 id는 1부터 연속 부여한다', () => {
    const rules = compile(
      stateWith({
        headerRules: [header({ id: 'a' }), header({ id: 'b', name: 'X-Two' })],
        redirectRules: [redirect()],
      }),
    );
    expect(rules.map((r) => r.id)).toEqual([1, 2, 3]);
  });
});
