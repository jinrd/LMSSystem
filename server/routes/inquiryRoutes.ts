import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { createInquiry, getInquiries, answerInquiry } from "../controllers/inquiryController";

const router = express.Router();

// 학생: 문의 생성
router.post("/", verifyToken, createInquiry);

// 학생 및 관리자: 문의 목록 조회
router.get("/", verifyToken, getInquiries);

// 강사/관리자: 문의 답변 (PATCH 사용)
router.patch("/:id/answer", verifyToken, isAdmin, answerInquiry);

export default router;
