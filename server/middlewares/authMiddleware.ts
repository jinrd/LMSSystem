import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import AppError from "../utils/AppError";

// Request 객체에 user 속성이 있음을 TypeScript에 알림
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 1. 토큰 검증 미들웨어
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("인증 토큰이 필요합니다.", 401));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(new AppError("유효하지 않거나 만료된 토큰입니다.", 403));
    }
    req.user = user;
    next();
  });
};

// 2. 관리자 권한 확인 미들웨어
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // verifyToken이 먼저 실행되어 req.user가 설정되어 있어야 함
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    next(new AppError("원장님 권한이 필요합니다.", 403));
  }
};

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  // verifyToken이 먼저 실행되어 req.user가 설정되어 있어야 함
  if (req.user && (req.user.role === "TEACHER" || req.user.role === "ADMIN")) {
    next();
  } else {
    next(new AppError("선생님 권한이 필요합니다.", 403));
  }
};