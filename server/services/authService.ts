import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import { JWT_SECRET } from "../config";
import AppError from "../utils/AppError";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 회원가입 비즈니스 로직
const registerUser = async (userData: any) => {
  const { email, password, name, termsAgreed, phone } = userData;

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
      phone,
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

// [비밀번호 잊음] 비즈니스 로직
const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("가입되지 않은 이메일입니다.", 404);
  }

  // 1. 임시 토큰 생성(보안이 강화된 랜덤 문자열 64글자)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. DB 에 토큰과 만료시간(1시간 뒤) 업데이트
  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000)
    }
  });
  // 3. 이메일 발송 (Nodemailer 사용)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"LMS 시스템" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "[LmsSystem] 비밀번호 재설정 안내",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b;">비밀번호 재설정</h2>
        <p style="color: #475569; line-height: 1.6;">안녕하세요. 비밀번호 재설정 요청이 접수되었습니다.<br/>아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.</p>
        <p style="color: #ef4444; font-size: 14px;"><strong>이 링크는 1시간 동안만 유효합니다.</strong></p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/reset-password?token=${resetToken}" style="padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            비밀번호 재설정하기
          </a>
        </div>
        
        <p style="margin-top: 20px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          버튼이 클릭되지 않는다면, 아래 링크를 복사하여 브라우저의 주소창에 붙여넣으세요:<br>
          <a href="http://localhost:5173/reset-password?token=${resetToken}" style="color: #2563eb; word-break: break-all;">
            http://localhost:5173/reset-password?token=${resetToken}
          </a>
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("이메일 발송 오류:", error);
    throw new AppError("이메일 발송에 실패했습니다. 메일 서버 설정을 확인해주세요.", 500);
  }

  return { message: "비밀번호 재설정 링크가 이메일로 발송되었습니다." };
}

const resetPassword = async (token: string, newPassword: string) => {
  // 1. 토큰이 일치하고 아직 만료됮 ㅣ않은 유저 찾기
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        gt: new Date(), // 현재 시간보다 만료 시간이 커야 함(만료 전)
      }
    }
  })

  if (!user) {
    throw new AppError("유효하지 않거나 만료된 재설정 링크입니다.", 400);
  }

  // 2. 새 비밀번호 해싱
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 3. DB 업데이트 (새 비밀번호 적용, 토큰 무효화, 잠김 계정이면 해제)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      failedLoginAttempts: 0, // 비밀번호 오류 횟수 초기화
      lockedUntil: null,      // 계정 잠금 해제
    },
  });
  return { message: "비밀번호가 성공적으로 변경되었습니다." };
}

// 모듈 export 부분에 새로 만든 함수들 추가
export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
