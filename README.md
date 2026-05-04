# LmsSystem

미용 학원 LMS 시스템의 초기 로그인 및 회원 관리 기능을 위한 뼈대 프로젝트입니다. 유지보수성과 확장성을 고려하여 프론트엔드와 백엔드가 완벽하게 분리된 아키텍처로 구성되었습니다.

## 🛠️ 기술 스택
- **Frontend**: React (Vite), Tailwind CSS v4, React Router DOM, Lucide-react
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, bcrypt

---

## 📂 전체 디렉토리 구조 요약
```text
LmsSystem/
├── 📁 client/   (프론트엔드 - 포트: 5173)
└── 📁 server/   (백엔드 - 포트: 5001)
```

---

## 🖥️ 1. 백엔드 (`server` 폴더)
API를 제공하고 데이터베이스와 통신하는 역할을 합니다. macOS의 AirPlay 충돌 방지를 위해 **포트 `5001`**에서 실행됩니다.

* **`server.js`**: 백엔드의 **핵심(Main) 파일**
  * Express 서버를 설정하고 실행합니다.
  * 프론트엔드 통신을 위한 CORS 설정이 포함되어 있습니다.
  * 회원가입(`/api/auth/register`), 로그인(`/api/auth/login`), 회원 목록(`/api/users`) API 로직이 모여 있습니다.
  * JWT 토큰 발급 및 검증 로직을 담당합니다.
* **`prisma/schema.prisma`**: **데이터베이스 설계도**
  * PostgreSQL DB 설정과 `User` 테이블의 구조(이메일, 이름, 비밀번호, 가입일 등)를 정의한 파일입니다.
* **`prisma.config.ts`**: Prisma 7 버전에 맞춘 데이터베이스 연결 설정 파일입니다.
* **`.env`**: **환경 변수 파일**
  * 데이터베이스 URL, JWT 시크릿 키, 포트 번호 등 민감한 정보가 저장되어 있습니다.
* **`package.json`**: 백엔드 의존성 패키지 및 실행 스크립트(`npm run dev`) 설정.

---

## 🎨 2. 프론트엔드 (`client` 폴더)
사용자 UI를 담당하며, Vite 기반으로 **포트 `5173`**에서 실행됩니다.

* **`src/main.jsx` & `App.jsx`**: **프론트엔드의 진입점**
  * `main.jsx`에서 React 앱을 실행합니다.
  * `App.jsx`에서 React Router를 사용해 페이지 경로(`/login`, `/register`, `/users`)를 설정합니다.
* **`src/pages/`**: 화면(UI) 컴포넌트 폴더
  * **`Register.jsx`**: 회원가입 폼. 사용자의 입력을 단방향 데이터 바인딩으로 관리하며, 백엔드 API를 호출해 계정을 생성합니다.
  * **`Login.jsx`**: 로그인 폼. 로그인 성공 시 백엔드로부터 받은 'JWT 토큰'을 로컬 스토리지에 안전하게 저장합니다.
  * **`UserList.jsx`**: 회원 목록 테이블. 로컬 스토리지의 토큰을 헤더에 담아 백엔드에 요청하고, 가입된 회원 데이터를 화면에 표시합니다.
* **`src/index.css`**: Tailwind CSS v4가 적용된 **글로벌 스타일 파일**입니다. (`@import "tailwindcss";` 포함)
* **`vite.config.js`**: Vite 빌드 도구의 설정 파일로, React와 Tailwind CSS 플러그인이 설정되어 있습니다.

---

## 🚀 실행 방법

### 백엔드 실행
```bash
cd server
npm run dev
```

### 프론트엔드 실행
새 터미널을 열고 실행합니다.
```bash
cd client
npm run dev
```

---

## 💡 데이터 흐름 요약 (로그인 예시)
1. **[Client]** 사용자가 `Login.jsx` 화면에서 이메일/비밀번호 입력 후 로그인 버튼 클릭
2. **[Client]** 백엔드(`http://localhost:5001/api/auth/login`)로 데이터 전송 (Fetch API)
3. **[Server]** `server.js`가 데이터를 받아 `Prisma`를 통해 DB에서 회원 조회 및 비밀번호 일치 여부 확인
4. **[Server]** 인증 성공 시 JWT 토큰(출입증)을 생성하여 프론트엔드로 응답
5. **[Client]** 토큰을 받아 로컬 스토리지에 저장하고, 회원 목록 페이지(`/users`)로 이동하여 데이터를 불러옴
