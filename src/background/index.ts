import { loadState, STATE_KEY, saveCompileError } from '../shared/storage';
import { badgeText } from './badge';
import { compile } from './compile';

// 컴파일 직렬화 큐(depth 1): 실행 중 새 변경이 오면 끝난 뒤 한 번 더 실행해
// 항상 마지막 상태가 반영되게 한다 (스펙 §DNR 컴파일 명세).
let running = false;
let pending = false;

async function applyBadge(text: string): Promise<void> {
  await chrome.action.setBadgeText({ text });
  if (text) {
    await chrome.action.setBadgeBackgroundColor({
      color: text === 'ERR' ? '#D93025' : '#26A756',
    });
  }
}

async function sync(): Promise<void> {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  try {
    const state = await loadState();
    const rules = compile(state);
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existing.map((r) => r.id),
      addRules: rules as unknown as chrome.declarativeNetRequest.Rule[],
    });
    await saveCompileError(null);
    await applyBadge(
      badgeText({
        enabled: state.globalEnabled,
        ruleCount: rules.length,
        error: false,
      }),
    );
  } catch (err) {
    await saveCompileError(err instanceof Error ? err.message : String(err));
    await applyBadge('ERR');
  } finally {
    running = false;
    if (pending) {
      pending = false;
      void sync();
    }
  }
}

chrome.runtime.onInstalled.addListener(() => void sync());
chrome.runtime.onStartup.addListener(() => void sync());
// state 키 변경에만 반응 — 워커 자신이 쓰는 lastCompileError로 재귀하지 않도록
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && STATE_KEY in changes) void sync();
});
