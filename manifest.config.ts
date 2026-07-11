import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'handy-header',
  version: '0.1.0',
  description: 'HTTP 요청/응답 헤더 수정 + URL 리다이렉트',
  action: { default_popup: 'src/app/index.html' },
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  permissions: ['declarativeNetRequest', 'storage'],
  host_permissions: ['<all_urls>'],
})
