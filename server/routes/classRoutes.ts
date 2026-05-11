import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import classController from "../controllers/classController";

const router = express.Router();

// 1. 특정 강좌(Class) 상세 조회
router.get("/:id", classController.getClassById);

// 2. 새로운 강좌(Class) 개설 및 스케줄 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, classController.createClass);

// 3. 강좌 삭제 (관리자 전용)
router.delete("/:id", verifyToken, isAdmin, classController.deleteClass);

// 4. 특정 강좌의 수강생 목록 조회 (관리자 전용)
router.get("/:id/enrollments", verifyToken, isAdmin, classController.getEnrollments);

// 5. 특정 강좌에 수강생 등록 (관리자 전용)
router.post("/:id/enrollments", verifyToken, isAdmin, classController.enrollStudent);

// 6. 특정 강좌에서 수강생 제거 (관리자 전용)
router.delete("/:id/enrollments/:studentId", verifyToken, isAdmin, classController.removeStudent);

export default router;
