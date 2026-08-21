import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';

// 버전은 dist/manifest.json에서 읽는다 — package.json 버전과는 무관하다
const { version } = JSON.parse(readFileSync('dist/manifest.json', 'utf8'));
const out = `release/handy-header-${version}.zip`;

mkdirSync('release', { recursive: true });
rmSync(out, { force: true });
// manifest.json이 zip 루트에 와야 웹 스토어가 받는다 — dist 안에서 압축한다
execFileSync('zip', ['-qr', `../${out}`, '.', '-x', '.DS_Store', '__MACOSX/*'], {
  cwd: 'dist',
});
console.log(`${out} (${(statSync(out).size / 1024).toFixed(0)} KB)`);
