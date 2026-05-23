import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

// 회원가입 컨트롤러
const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name, termsAgreed, phone } = req.body;

  // 필수 입력값 및 데이터 타입 검증
  if (!email || !password || !name) {
    throw new AppError("모든 필수 항목을 입력해주세요.", 400);
  }

  if (!termsAgreed) {
    throw new AppError("이용약관 및 개인정보 처리방침에 동의해야 회원가입이 가능합니다.", 400);
  }

  const user = await authService.registerUser({ email, password, name, termsAgreed, phone });

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

const forgot_password = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("이메일을 입력해주세요.", 400);
  }

  const result = await authService.forgotPassword(email);

  res.status(200).json(result)

})


const reset_password = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  // token은 쿼리스트링이나 바디 어디서든 받아오게 프론트에서 보내줘야 합니다.
  if (!token || !newPassword) {
    throw new AppError("토큰과 새 비밀번호를 모두 입력해주세요.", 400);
  }
  // 서비스 계층으로 token과 새 비밀번호 전달
  const result = await authService.resetPassword(token, newPassword);
  res.status(200).json(result);
});

export default {
  register,
  login,
  forgot_password,
  reset_password
};
