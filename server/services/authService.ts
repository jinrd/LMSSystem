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

  // 계정 잠금 상태 확인
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    // 잠금 남은 시간 계산
    const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - new Date().getTime()) / 60000);
    throw new AppError(`계정이 잠겼습니다. ${remainingMinutes}분 뒤에 다시 시도해주세요.`, 403);
  }

  // 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const newAttempts = user.failedLoginAttempts + 1;

    let lockUntil = null;

    if (newAttempts >= 5) {
      lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 현재 시간 + 15분
    }

    // db 업데이트
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: newAttempts,
        lockedUntil: lockUntil
      }
    })

    if (newAttempts >= 5) {
      throw new AppError("비밀번호를 5회 연속 틀려 계정이 15분간 잠깁니다.", 403);
    } else {
      throw new AppError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
    }
  }

  // 5. 로그인 성공 시: 기존에 실패 횟수가 있었다면 0으로 초기화
  if (user.failedLoginAttempts > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }


  // JWT 토큰 발급 (학생은 12시간, 그 외 관리자/강사는 1일 유효)
  const tokenExpiresIn = user.role === "STUDENT" ? "12h" : "1d";
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: tokenExpiresIn },
  );

  return {
    token,
    role: user.role,
    status: user.status
  };
};

export default {
  registerUser,
  loginUser,
};
