import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import { getSystemLogs } from "../controllers/systemLogController";

const router = express.Router();

// 관리자만 시스템 로그 열람 가능
router.get("/", verifyToken, isAdmin, getSystemLogs);

export default router;
