# Changelog

## 0.3.0

### Changed

- **redirect 룰이 항상 URL 치환으로 동작한다.** `match`에 와일드카드가 하나도
  없으면 뒤에 `*`가 붙은 것으로 보고 접두사로 매치하며, `target`이 `match`의
  마지막 캡처를 쓰지 않으면 그 꼬리를 `target` 끝에 이어붙인다.

  ```
  match  https://api.prod.example.com
  target http://localhost:8080

  요청   https://api.prod.example.com/users?x=1
  결과   http://localhost:8080/users?x=1
  ```

  이전에는 `match`가 `^…$`로 앵커돼 URL이 정확히 일치할 때만 걸렸고,
  `target`에 `*`가 없으면 경로·쿼리스트링을 버리고 고정 URL로 보냈다.
  `match`에 `*`를 직접 쓴 경우는 명시적 패턴으로 보고 그대로 둔다.

  호환성 주의: 와일드카드 없는 `match`로 URL 하나만 정확히 잡던 룰은 이제
  그 접두사로 시작하는 URL 전체를 잡는다.

### Fixed

- 코드 폰트를 쓰는 입력 칸에서 `//`가 슬래시 하나로 보이던 문제. 폰트 스택이
  JetBrains Mono로 폴백될 때 합자가 앞 슬래시를 빈 글리프로 그렸다. `.mono`에
  `font-variant-ligatures: none`을 적용했다. 저장된 값은 원래부터 정상이었고
  화면 표시만 잘못됐다.

## 0.2.0

### Added

- 우클릭 옵션 메뉴에서 전체 탭으로 열기

### Fixed

- 붙여넣기 시 클립보드의 서식이 입력 칸에 남던 문제

## 0.1.0

최초 릴리스.

### Added

- Request/Response 헤더 룰 추가·수정·삭제와 개별 on/off
- URL 리다이렉트 룰 (와일드카드 캡처·치환)
- 프로필 선택·추가·이름변경·삭제, JSON export/import
- 전역 on/off 토글과 활성 룰 개수 배지
- 룰 변경 시 declarativeNetRequest 동적 규칙 자동 동기화
