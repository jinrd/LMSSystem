import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// 회원가입 컨트롤러
const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name, termsAgreed } = req.body;

  // 필수 입력값 및 데이터 타입 검증
  if (!email || !password || !name) {
    throw new AppError("모든 필수 항목을 입력해주세요.", 400);
  }

  if (!termsAgreed) {
    throw new AppError("이용약관 및 개인정보 처리방침에 동의해야 회원가입이 가능합니다.", 400);
  }

  const user = await authService.registerUser({ email, password, name, termsAgreed });

  res.status(201).json({
    message: "회원가입이 완료되었습니다.",
    user,
  });
});

// 로그인 컨트롤러
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new AppError("이메일과 비밀번호를 입력해주세요.", 400);
  }

  const result = await authService.loginUser({ email, password });

  res.json({ message: "로그인 성공", token: result.token, role: result.role });
});

export default {
  register,
  login,
};
