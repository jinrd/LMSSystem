# 💇‍♂️ LmsSystem (미용 학원 관리 시스템)

미용 학원 운영 관리를 위한 LMS(Learning Management System)의 기초 뼈대 프로젝트입니다. 프론트엔드와 백엔드가 완벽히 분리된 구조로, 강력한 보안과 역할 기반 접근 제어(RBAC)를 지원합니다.

## 🛠️ 기술 스택
- **Frontend**: React (Vite), Tailwind CSS v4, React Router DOM, Lucide-react
- **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, bcrypt

---

## 📂 전체 디렉토리 구조
```text
LmsSystem/
├── 📁 client/           (프론트엔드 - 포트: 5173)
│   ├── 📁 src/
│   │   ├── 📁 components/   (공통 컴포넌트 - TermsModal 등)
│   │   └── 📁 pages/
│   │       ├── 📁 common/   (로그인, 회원가입)
│   │       ├── 📁 admin/    (회원 목록 관리)
│   │       └── 📁 student/  (학습 대시보드)
└── 📁 server/           (백엔드 - 포트: 5001)
    ├── 📁 routes/       (인증, 유저, 약관 API)
    ├── 📁 middlewares/  (JWT 검증, 관리자 권한 체크)
    └── 📁 prisma/       (DB 스키마 설계도)
```

---

## 🔐 주요 기능 및 보안 정책

### 1. 역할 기반 접근 제어 (RBAC)
사용자는 가입 시 기본적으로 `STUDENT` 역할을 부여받으며, 시스템은 두 종류의 권한을 엄격히 구분합니다.
*   **ADMIN (관리자)**: 모든 페이지 접근 가능, 전체 회원 목록 조회 및 관리 권한.
*   **STUDENT (수강생)**: 본인의 학습 대시보드만 접근 가능. 관리자 페이지 접근 시 자동 차단 및 리다이렉트.

### 2. 페이지 보안 (Frontend Guard)
*   **PublicRoute**: 로그인/회원가입 페이지 전용. 이미 로그인한 사용자가 접근 시 각자의 메인 페이지로 자동 이동.
*   **PrivateRoute**: 로그인한 모든 사용자(학생+관리자)용. 대시보드 등 공통 기능 접근 가능.
*   **AdminRoute**: 오직 관리자만 접근 가능. 보안 위반 시 경고 알림 및 리다이렉트.

### 3. 법적 규제 준수 (약관 동의)
*   회원가입 시 **이용약관** 및 **개인정보 처리방침** 동의가 필수입니다.
*   약관 내용은 백엔드 API를 통해 실시간으로 호출되며, `TermsModal`을 통해 확인할 수 있습니다.

---

## 🖥️ 백엔드 주요 구성 (`server`)

*   **`routes/`**: API 엔드포인트 모듈화
    *   `authRoutes.js`: 회원가입, 로그인 로직 (비밀번호 bcrypt 암호화)
    *   `userRoutes.js`: 관리자용 유저 리스트 조회
    *   `termsRoutes.js`: 시스템 이용 약관 제공
*   **`middlewares/authMiddleware.js`**:
    *   `verifyToken`: 클라이언트 JWT 유효성 검사
    *   `isAdmin`: DB의 `role` 필드를 체크하여 관리자 여부 확인
*   **`prisma/schema.prisma`**: PostgreSQL 데이터베이스 모델 정의 (User 모델 - email, role, termsAgreed 등)

---

## 🎨 프론트엔드 주요 구성 (`client`)

*   **`App.jsx`**: 중앙 집중식 라우팅 및 권한별 보호 라우트 설정
*   **`pages/student/StudentDashboard.jsx`**: 수강생 학습 현황 요약 및 로그아웃 기능
*   **`pages/admin/UserList.jsx`**: 전체 가입자 정보(이름, 이메일, 가입일) 조회 테이블
*   **`components/TermsModal.jsx`**: API로부터 받은 HTML 약관 내용을 안전하게 렌더링하는 공용 모달

---

## 🚀 시작하기

### 1. 백엔드 설정 및 실행
```bash
cd server
# .env 파일 생성 (DATABASE_URL, JWT_SECRET 설정)
npm install
npm run dev
```

### 2. 프론트엔드 설정 및 실행
```bash
cd client
npm install
npm run dev
```

---

## 💡 데이터 흐름 (로그인 절차)
1. **[Client]** 로그인 시도 -> 서버로 이메일/비밀번호 전송
2. **[Server]** 인증 성공 시 `userId`와 `role`이 담긴 **JWT 토큰** 발급
3. **[Client]** 토큰과 `role`을 로컬 스토리지에 저장
4. **[Client]** `App.jsx`의 가드 로직이 `role`에 따라 `/users`(관리자) 또는 `/dashboard`(학생)로 자동 안내
5. **[Client]** 이후 API 요청 시 헤더에 토큰을 동봉하여 보안 검증 수행
