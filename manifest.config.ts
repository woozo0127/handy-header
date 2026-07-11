import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'HandyHeader',
  version: '0.1.0',
  description: 'HTTP 요청/응답 헤더 수정 + URL 리다이렉트',
  icons: {
    16: 'public/icons/icon-16.png',
    32: 'public/icons/icon-32.png',
    48: 'public/icons/icon-48.png',
    128: 'public/icons/icon-128.png',
  },
  action: {
    default_popup: 'src/app/index.html',
    default_icon: {
      16: 'public/icons/icon-16.png',
      32: 'public/icons/icon-32.png',
    },
  },
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  permissions: ['declarativeNetRequest', 'storage'],
  host_permissions: ['<all_urls>'],
});
