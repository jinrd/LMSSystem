import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient";

// 인터페이스 확장(req.user 를 가져오기 위함)
interface CustomRequest extends Request {
  user?: any;
}

const errorHandler = async (
  err: any,
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.error(`🔥 [ERROR] ${req.method} ${req.originalUrl} >> ${err.message}`);

  // DB 에러 로그 저장
  try {
    await prisma.systemLog.create({
      data: {
        level: "ERROR",
        message: err.message || "Unknown Error",
        stack: err.stack,
        route: `${req.method} ${req.originalUrl}`,
        userId: req.user?.userId || null // 로그인된 유저가 발생시킨 에러라면 ID 기록
      }
    });
  } catch (logError) {
    console.error("로그 저장 실패:", logError);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "서버 내부 오류가 발생했습니다.";

  // Prisma 예외 처리 (예: 고유 제약 조건 위반)
  if (err.code === "P2002") {
    statusCode = 400;
    message = "중복된 데이터가 존재합니다.";
  }

  res.status(statusCode).json({
    success: false,
    message: message, // API 응답 통일성을 위해 error 대신 message 사용
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
