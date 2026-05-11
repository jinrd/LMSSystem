import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// [API] 1. 회원가입
router.post("/register", authController.register);

// [API] 2. 로그인
router.post("/login", authController.login);

export default router;
