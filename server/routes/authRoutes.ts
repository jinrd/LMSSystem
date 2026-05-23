import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// [API] 1. 회원가입
router.post("/register", authController.register);

// [API] 2. 로그인
router.post("/login", authController.login);

// [API] 3. 비밀번호 잊음
router.post("/forgot-password", authController.forgot_password);

// [API] 4. 비밀번호 초기화
router.post("/reset-password", authController.reset_password);

export default router;
