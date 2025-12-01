# server-storage
파일시스템에 저장하고 public하게 접근할 수 있도록 하는 서버

- http://localhost:80 : 파일 목록 조회
- http://localhost:80/dashboard.html : 파일 업로드
- http://localhost:80/file.html?file=filename : 파일 상세 보기

# 핵심 기능
- 파일 업로드
- 파일 삭제
- 파일 목록 조회
- 파일 다운로드

# 사용 테크
- frontend : 순수 html, css, js
- backend : nodejs, express