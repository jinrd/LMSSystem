# LmsSystem - Server (백엔드)

이 디렉토리는 미용 학원 관리 시스템(LmsSystem)의 백엔드 API 서버를 포함하고 있습니다. Node.js, Express, 그리고 Prisma ORM을 사용하여 구축된 RESTful API 서버입니다.

## 🛠️ 기술 스택
- **런타임 및 프레임워크**: Node.js, Express.js
- **언어**: TypeScript
- **데이터베이스 및 ORM**: PostgreSQL, Prisma
- **보안 및 인증**: JWT (JSON Web Token), bcrypt

## 📂 주요 폴더 구조
- `controllers/`: 클라이언트의 요청을 받아 처리하고 응답을 반환하는 컨트롤러 계층
- `services/`: 핵심 비즈니스 로직 수행 및 데이터베이스 통신을 담당하는 서비스 계층
- `routes/`: API 엔드포인트 정의 및 라우팅 설정 (관리자, 강사, 수강생 권한별 라우팅)
- `middlewares/`: JWT 토큰 검증, 관리자 권한 확인 및 전역 에러 처리 미들웨어
- `prisma/`: 데이터베이스 스키마(`schema.prisma`) 정의 및 마이그레이션 관리
- `utils/`: 비동기 에러 래퍼(catchAsync), 커스텀 에러 클래스 등 유틸리티 함수

## ✨ 최근 추가된 주요 API 기능
- **강사(TEACHER) 대시보드 API**: 담당 강의 목록, 수강생 통계, 오늘 스케줄 상세 리스트 제공
- **강사 전용 수강생 명단 API**: 권한 검증을 통해 본인이 담당하는 클래스의 학생 정보만 안전하게 조회

## 🚀 시작하기

### 필수 조건
- Node.js 환경
- PostgreSQL 데이터베이스 실행 환경

### 환경 변수 (.env) 설정
`server` 폴더 루트에 `.env` 파일을 생성하고 아래와 같이 환경 변수를 설정합니다.

```env
# 데이터베이스 연결 URL (환경에 맞게 수정)
DATABASE_URL="postgresql://user:password@localhost:5432/lms_db?schema=public"

# JWT 서명용 시크릿 키
JWT_SECRET="your_super_secret_key"

# 서버 포트 번호 (기본값: 5001)
PORT=5001
```

### 설치 및 서버 실행
```bash
# 의존성 패키지 설치
npm install

# Prisma 클라이언트 생성 (스키마 변경 시 필수)
npx prisma generate

# DB 스키마 동기화 (초기 설정 시)
npx prisma db push

# 개발용 서버 실행 (TypeScript 기반)
npm run dev
```