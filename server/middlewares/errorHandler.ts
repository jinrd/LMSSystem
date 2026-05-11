import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error :", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "서버 내부 오류가 발생했습니다.";

  // Prisma 예외 처리 (예: 고유 제약 조건 위반)
  if (err.code === "P2002") {
    statusCode = 400;
    message = "중복된 데이터가 존재합니다.";
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
