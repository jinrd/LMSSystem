import express from "express";
import dashboardController from "../controllers/dashboardController";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// 모든 대시보드 API는 로그인 필수 + 관리자 전용
router.use(verifyToken, isAdmin);

// [API] 관리자 대시보드 통계 조회 (GET /api/dashboard/admin/summary)
router.get("/admin/summary", dashboardController.getAdminSummary);

export default router;
