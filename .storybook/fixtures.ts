import type { AppActions } from '../src/app/hooks/useAppState';
import type { AppState, Profile } from '../src/shared/types';

export const noopActions: AppActions = {
  toggleGlobal: () => {},
  selectProfile: () => {},
  addProfile: () => {},
  renameProfile: () => {},
  removeProfile: () => {},
  importProfile: () => {},
  addHeaderRule: () => '',
  updateHeaderRule: () => {},
  removeHeaderRule: () => {},
  addRedirectRule: () => '',
  updateRedirectRule: () => {},
  removeRedirectRule: () => {},
};

export const sampleProfile: Profile = {
  id: 'default',
  name: 'Default',
  headerRules: [
    {
      id: 'h1',
      enabled: true,
      direction: 'request',
      name: 'Authorization',
      value: 'Bearer token123',
    },
    {
      id: 'h2',
      enabled: true,
      direction: 'request',
      name: 'X-Debug',
      value: 'true',
    },
    {
      id: 'h3',
      enabled: false,
      direction: 'response',
      name: 'Cache-Control',
      value: 'no-store',
    },
  ],
  redirectRules: [
    {
      id: 'r1',
      enabled: true,
      match: 'https://api.example.com/*',
      target: 'http://localhost:8080/*',
    },
  ],
};

export const longContentProfile: Profile = {
  id: 'long',
  name: 'Long content',
  headerRules: [
    {
      id: 'h1',
      enabled: true,
      direction: 'request',
      name: 'Accept',
      value: 'application/json',
    },
    {
      id: 'h2',
      enabled: true,
      direction: 'request',
      name: 'Authorization',
      value:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0',
    },
    {
      id: 'h3',
      enabled: true,
      direction: 'request',
      name: 'X-Very-Long-Custom-Header-Name-For-Testing',
      value: 'short',
    },
    {
      id: 'h4',
      enabled: true,
      direction: 'request',
      name: 'X-Another-Extremely-Long-Header-Name',
      value: 'asdasdsadasdsaaasdasdsadasdsaaasdasdsadasdsaaasdasdsadasdsaaa',
    },
    {
      id: 'h5',
      enabled: true,
      direction: 'response',
      name: 'Access-Control-Allow-Origin',
      value: '*',
    },
    {
      id: 'h6',
      enabled: false,
      direction: 'response',
      name: 'X-Disabled-But-Also-Quite-Long-Header',
      value: 'off',
    },
  ],
  redirectRules: [
    {
      id: 'r1',
      enabled: true,
      match: 'https://api.production.example.com/v1/some/really/deep/path/*',
      target: 'http://localhost:8080/v1/some/really/deep/path/*',
    },
    {
      id: 'r2',
      enabled: false,
      match: 'https://cdn.example.com/assets/*',
      target: 'http://localhost:5173/assets/*',
    },
  ],
};

export const emptyProfile: Profile = {
  id: 'empty',
  name: 'Empty',
  headerRules: [],
  redirectRules: [],
};

export const sampleState: AppState = {
  version: 1,
  globalEnabled: true,
  activeProfileId: sampleProfile.id,
  profiles: [sampleProfile, longContentProfile, emptyProfile],
};
