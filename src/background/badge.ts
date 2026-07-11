export function badgeText(input: {
  enabled: boolean;
  ruleCount: number;
  error: boolean;
}): string {
  if (input.error) return 'ERR';
  if (!input.enabled || input.ruleCount === 0) return '';
  return String(input.ruleCount);
}
