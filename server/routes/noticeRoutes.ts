import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import noticeController from "../controllers/noticeController";

const router = express.Router();

// [API] 공지사항 목록 조회 (페이징 적용)
router.get("/", verifyToken, noticeController.getNotices);

// [API] 공지사항 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, noticeController.createNotice);

// [API] 공지사항 상세 조회
router.get("/:id", verifyToken, noticeController.getNoticeById);

// [API] 공지사항 수정 (관리자 전용)
router.put("/:id", verifyToken, isAdmin, noticeController.updateNotice);

// [API] 공지사항 삭제 (관리자 전용)
router.delete("/:id", verifyToken, isAdmin, noticeController.deleteNotice);

export default router;
