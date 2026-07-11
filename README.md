# handy-header

HTTP 요청/응답 헤더 수정 + URL 리다이렉트 크롬 확장 (Manifest V3, 개인용).

## 설치
1. `npm install && npm run build`
2. chrome://extensions → 개발자 모드 → "압축해제된 확장 프로그램 로드" → `dist/`

## 사용법
- Headers 탭: Request/Response 그룹별로 `이름: 값` 룰 추가. 이름·값 클릭으로 인라인 편집 (Enter 커밋 / Esc 취소)
- Redirect 탭: `매치 패턴 → 타겟 패턴` (`*` 와일드카드, 순서 대응)
- 프로필: 타이틀바에서 전환·추가·이름변경·삭제. 룰은 프로필별 저장
- 툴바 배지 = 현재 적용 중인 규칙 수. 규칙이 없으면 배지도 없음

## ⚠️ 주의
- 헤더 룰은 **모든 URL**에 적용된다. `Authorization`을 켜두면 방문하는 모든
  사이트에 토큰이 전송된다. 쓰지 않을 때는 전역 토글을 꺼둘 것 (배지로 상태 확인).

## 알려진 제약
- **미검증 (문서 기반)**: 아래 내용은 실제 브라우저 수동 검증(스펙 §테스트 전략
  체크리스트) 전에 코드/스펙 근거만으로 작성되었다. 실사용 검증 후 이 절을 갱신할 것.
- Chrome의 `declarativeNetRequest`는 API 차원에서 일부 요청 헤더의 수정을 제한할
  수 있다 (예: `Host`, `Content-Length`, `Cookie` 등 브라우저가 보호하는 헤더).
  이런 헤더를 룰로 추가해도 실제 요청에는 반영되지 않을 수 있다.
- 위 제한이 실제로 어떤 헤더에 어떻게 적용되는지는 브라우저 수동 검증 후 구체적인
  헤더 목록으로 갱신 예정.

## 개발
- `npm run dev` — Vite HMR (CRXJS)
- `npm test` — compile/badge/storage 단위 테스트
- `node scripts/gen-icons.mjs` — 아이콘 PNG 재생성
