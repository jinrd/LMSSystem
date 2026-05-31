import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

// 분리된 라우트 모듈 가져오기
import dashboardRoutes from "./routes/dashboardRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import termsRoutes from "./routes/termsRoutes";
import courseRoutes from "./routes/courseRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import classRoutes from "./routes/classRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import inquiryRoutes from "./routes/inquiryRoutes";
import systemLogRoutes from "./routes/systemLogRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 5001;

// [보안 및 로깅 미들웨어]
app.use(helmet()); // HTTP 응답 헤더 보안 설정
app.use(morgan("dev")); // 요청 로깅 (디버깅용)

// Rate Limiter: 무차별 대입 공격 및 DDOS 방어
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 100번의 요청 허용
  message: {
    success: false,
    error: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
  },
});
app.use("/api", apiLimiter); // /api로 시작하는 모든 라우트에 적용

// 기본 미들웨어 설정
app.use(cors()); // 프론트엔드와 통신을 위해 CORS 허용
app.use(express.json()); // JSON 바디 파싱
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // 업로드된 정적 파일 제공

// API 라우트 연결 (URL 모듈화)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/terms", termsRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/system-logs", systemLogRoutes);

// 전역 에러 핸들러
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
