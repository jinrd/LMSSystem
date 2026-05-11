import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import { JWT_SECRET } from "../config";
import AppError from "../utils/AppError";

// 회원가입 비즈니스 로직
const registerUser = async (userData: any) => {
  const { email, password, name, termsAgreed } = userData;

  // 이메일 중복 체크
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError("이미 사용 중인 이메일입니다.", 400);
  }

  // 비밀번호 안전하게 해싱
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // DB에 유저 생성
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      termsAgreed,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };
};

// 로그인 비즈니스 로직
const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  // 유저 조회
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  // 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  // JWT 토큰 발급 (1일 유효)
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    role: user.role,
  };
};

export default {
  registerUser,
  loginUser,
};
