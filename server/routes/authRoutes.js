const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { JWT_SECRET } = require("../config");

const router = express.Router();

// [API] 1. 회원가입
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, termsAgreed } = req.body;

    // 필수 입력값 및 데이터 타입 검증
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "모든 필수 항목을 입력해주세요." });
    }

    // 약관 동의 검증 (동의하지 않으면 회원가입 거부)
    if (!termsAgreed) {
      return res.status(400).json({
        message:
          "이용약관 및 개인정보 처리방침에 동의해야 회원가입이 가능합니다.",
      });
    }

    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "이미 사용 중인 이메일입니다." });
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
        termsAgreed, // 약관 동의 받은 값
      },
    });

    res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// [API] 2. 로그인
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유저 조회
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    // JWT 토큰 발급 (1시간 유효)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({ message: "로그인 성공", token, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
  }
});

module.exports = router;
