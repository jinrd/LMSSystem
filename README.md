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

## 📈 프로젝트 진행 상황 및 로드맵

### ✅ 완료된 사항 (Completed)
- [x] **프로젝트 초기 구조 설계**: Client(React)와 Server(Node.js)의 완전한 분리 및 연동
- [x] **데이터베이스 모델링**: Prisma를 이용한 `User`, `Course` 스키마 설계 및 PostgreSQL 연동
- [x] **인증 및 보안 시스템**:
    - JWT 기반 토큰 인증 및 bcrypt 비밀번호 암호화
    - 역할 기반 접근 제어(RBAC: ADMIN, TEACHER, STUDENT) 구현
    - 프론트엔드 보호 라우트(Protected Routes) 설정
- [x] **회원 관리 기초**: 
    - 이용약관 및 개인정보 처리방침 동의 로직
    - 관리자용 전체 회원 목록 조회 페이지
    - 회원 검색(이름/이메일) 및 직급(역할) 변경 기능
- [x] **공통 기능 및 마이페이지**: 
    - 역할별 사이드바 기반 공통 레이아웃 구축
    - 사용자 내 정보 수정 및 안전한 비밀번호 변경 로직 연동
- [x] **강의 관리 시스템(CRUD)**: 과목(Course)과 강좌(Class)를 분리한 아키텍처 설계, 강좌별 스케줄 관리 및 관리자용 수강생 직접 등록 시스템 구현
- [x] **학원 스케줄 캘린더**: FullCalendar를 연동한 관리자용 전체 수업 일정 및 강사 스케줄 시각화
- [x] **공지사항 게시판(CRUD)**: 공지사항 목록 페이징 및 관리자용 작성, 수정, 삭제 기능 구현
- [x] **기본 UI 프레임워크**: Tailwind CSS v4 기반의 반응형 레이아웃 및 공통 컴포넌트(모달 등) 구축
- [x] **강사용 대시보드 (Teacher Dashboard)**: 
    - 프리미엄 UI가 적용된 강사 전용 대시보드 구축
    - 당일 담당 수업 타임라인 및 최근 공지사항 연동
    - 담당 강의 목록 및 수강생 명단 상세 조회 연동
- [x] **학생용 대시보드 (Student Dashboard)**: 
    - 학생 본인이 수강 중인 강의 목록과 상태 확인
    - 오늘 스케줄 타임라인 시각화
    - 학원 최근 공지사항 연동
- [x] **아키텍처 최적화 (관심사 분리)**: 
    - 기존 공용 상세 페이지를 강사용(`TeacherClassDetail`)과 학생용(`StudentClassDetail`)으로 완전히 분리
    - 백엔드 비즈니스 로직을 Controller에서 Service 계층으로 이관 (Thin Controller)
    - 역할별 API 응답 데이터(DTO) 구조 일관성 확보

### 🚀 향후 구현 예정 기능 (To-do)

#### 1. 과제 및 평가 시스템 (Assignments & Grading)
- [ ] **과제 출제 및 제출**: 강사가 실습 과제를 출제하고 학생이 결과물(사진, 텍스트)을 업로드하여 제출하는 기능
- [ ] **채점 및 피드백**: 제출된 과제에 대해 강사가 점수를 매기고 피드백 코멘트를 남기는 시스템

#### 3. 강의 및 수강 관리 (Course Management)
- [ ] **강의 콘텐츠 업로드**: 동영상 강의(Vimeo/YouTube 연동) 및 학습 자료(PDF) 업로드 기능

#### 4. 학습 지원 기능 (Learning Tools)
- [ ] **출결 관리**: QR 코드 또는 위치 기반 출석 체크 시스템 (미용 실기 수업 대응)
- [ ] **성적표 및 수료증**: 학습 결과 조회 및 수료 요건 충족 시 자동 수료증 발급

#### 5. 커뮤니케이션 및 알림 (Communication)
- [ ] **1:1 문의 및 Q&A**: 학생과 강사 간의 학습 질문 피드백 채널
- [ ] **푸시 알림**: 수강 신청 결과, 과제 마감, 공지사항 알람 (FCM 또는 이메일)

#### 6. 결제 및 마이페이지 (Billing & Profile)
- [ ] **수강료 결제**: Portone 등 PG사 연동을 통한 수강료 결제 시스템
- [ ] **마이페이지**: 개인 프로필 수정, 수강 이력 확인, 결제 영수증 출력
- [ ] **통계 대시보드**: 관리자용 월별 매출 및 수강생 증가 추이 시각화
