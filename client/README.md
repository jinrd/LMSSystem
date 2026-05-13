# LmsSystem - Client (프론트엔드)

이 디렉토리는 미용 학원 관리 시스템(LmsSystem)의 프론트엔드 애플리케이션을 포함하고 있습니다. React와 Vite를 기반으로 구축되었으며, 수강생 및 관리자를 위한 사용자 인터페이스를 제공합니다.

## 🛠️ 기술 스택
- **프레임워크**: React, Vite
- **스타일링**: Tailwind CSS v4
- **라우팅**: React Router DOM
- **HTTP 클라이언트**: Axios
- **아이콘**: Lucide-react

## 📂 주요 폴더 구조
- `src/api`: 백엔드 API 통신을 위한 Axios 인스턴스 및 설정
- `src/assets`: 이미지, 아이콘 등 정적 리소스
- `src/components`: 재사용 가능한 UI 컴포넌트 (모달, 공통 레이아웃 등)
- `src/pages`: 라우트에 연결된 각 페이지 컴포넌트
  - `admin`: 관리자 전용 페이지 (회원 관리, 강의 일정, 대시보드 등)
  - `teacher`: 강사 전용 페이지 (강사 대시보드, `TeacherClassDetail` 등)
  - `student`: 수강생 전용 페이지 (학습 대시보드, `StudentClassDetail` 등)
  - `common`: 공통 페이지 (로그인, 회원가입, 공지사항, 마이페이지 등)
- `src/hooks`: 커스텀 React Hooks

## 🚀 시작하기

### 필수 조건
- Node.js 환경
- 백엔드(server)가 실행 중이어야 정상적인 API 통신이 가능합니다.

### 설치 및 개발 서버 실행
```bash
# 의존성 패키지 설치
npm install

# 개발 서버 시작 (기본 포트: 5173)
npm run dev
```

### 빌드
```bash
# 프로덕션용 빌드 생성
npm run build
```