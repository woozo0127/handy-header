import type { AppState, Profile } from './types';

export function createDefaultProfile(name = 'Profile 1'): Profile {
  return { id: crypto.randomUUID(), name, headerRules: [], redirectRules: [] };
}

export function createDefaultState(): AppState {
  const profile = createDefaultProfile();
  return {
    version: 1,
    globalEnabled: true,
    activeProfileId: profile.id,
    profiles: [profile],
  };
}
