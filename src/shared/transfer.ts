import type { HeaderRule, Profile, RedirectRule } from './types';

const FILE_TYPE = 'handy-header-profile';
const FILE_VERSION = 1;

export function serializeProfile(profile: Profile): string {
  return JSON.stringify(
    {
      type: FILE_TYPE,
      version: FILE_VERSION,
      profile: {
        name: profile.name,
        headerRules: profile.headerRules.map((r) => ({
          enabled: r.enabled,
          direction: r.direction,
          name: r.name,
          value: r.value,
        })),
        redirectRules: profile.redirectRules.map((r) => ({
          enabled: r.enabled,
          match: r.match,
          target: r.target,
        })),
      },
    },
    null,
    2,
  );
}

export function parseProfileFile(text: string): Profile {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON file');
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Not a HandyHeader profile file');
  }
  const file = data as Record<string, unknown>;
  if (file.type !== FILE_TYPE)
    throw new Error('Not a HandyHeader profile file');
  if (file.version !== FILE_VERSION)
    throw new Error('Unsupported file version');

  const profile = file.profile as Record<string, unknown> | null | undefined;
  if (
    typeof profile !== 'object' ||
    profile === null ||
    typeof profile.name !== 'string' ||
    !isExportedHeaderRules(profile.headerRules) ||
    !isExportedRedirectRules(profile.redirectRules)
  ) {
    throw new Error('Malformed profile data');
  }

  return {
    id: crypto.randomUUID(),
    name: profile.name.trim() === '' ? 'Imported profile' : profile.name,
    headerRules: profile.headerRules.map((r) => ({
      id: crypto.randomUUID(),
      enabled: r.enabled,
      direction: r.direction,
      name: r.name,
      value: r.value,
    })),
    redirectRules: profile.redirectRules.map((r) => ({
      id: crypto.randomUUID(),
      enabled: r.enabled,
      match: r.match,
      target: r.target,
    })),
  };
}

export function uniqueProfileName(
  name: string,
  existingNames: string[],
): string {
  if (!existingNames.includes(name)) return name;
  let n = 2;
  while (existingNames.includes(`${name} (${n})`)) n++;
  return `${name} (${n})`;
}

function isExportedHeaderRules(
  value: unknown,
): value is Omit<HeaderRule, 'id'>[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const r = item as Record<string, unknown>;
    return (
      typeof r.enabled === 'boolean' &&
      (r.direction === 'request' || r.direction === 'response') &&
      typeof r.name === 'string' &&
      typeof r.value === 'string'
    );
  });
}

function isExportedRedirectRules(
  value: unknown,
): value is Omit<RedirectRule, 'id'>[] {
  if (!Array.isArray(value)) return false;
  return value.every((item) => {
    if (typeof item !== 'object' || item === null) return false;
    const r = item as Record<string, unknown>;
    return (
      typeof r.enabled === 'boolean' &&
      typeof r.match === 'string' &&
      typeof r.target === 'string'
    );
  });
}
