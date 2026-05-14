import express from "express";
import { verifyToken, isTeacher } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import assignmentController from "../controllers/assignmentController";

const router = express.Router();

// [ 공통 ] 특정 반의 과제 목록 조회
router.get("/class/:classId", verifyToken, assignmentController.getAssignmentsByClass)

// ---------------- [ 강사 전용 ] ----------------
// 과제 출제
router.post("/class/:classId", verifyToken, isTeacher, assignmentController.createAssignment)

// 특정 과제의 제출 목록 조회
router.get("/:assignmentId/submissions", verifyToken, isTeacher, assignmentController.getSubmissions)

// 과제 채점 및 평가
router.put("/submissions/:submissionId/grade", verifyToken, isTeacher, assignmentController.gradeSubmission);

// ---------------- [ 수강생 전용 ] ----------------
// 과제 제출 (파일 업로드)
router.post("/:assignmentId/submit", verifyToken, upload.single("file"), assignmentController.submitAssignment)

export default router;
