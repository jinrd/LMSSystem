import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";
import courseController from "../controllers/courseController";

const router = express.Router();

// 1. 모든 과목(Course) 조회
router.get("/", courseController.getCourses);

// 2. 과목 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, courseController.createCourse);

// 3. 과목 수정 (관리자 전용)
router.put("/:id", verifyToken, isAdmin, courseController.updateCourse);

// 4. 과목 삭제
router.delete("/:id", verifyToken, isAdmin, courseController.deleteCourse);

export default router;
