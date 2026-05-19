import express from "express";
import { verifyToken, isAdmin, isTeacher } from "../middlewares/authMiddleware";
import userController from "../controllers/userController";


const router = express.Router();

// [API] 회원 목록 조회 (인증 필요)
router.get("/", verifyToken, isAdmin, userController.getUsers);

// [API] 내 정보 조회
router.get("/me", verifyToken, userController.getMe);

// [API] 내 정보 수정
router.put("/me", verifyToken, userController.updateMe);

// [API] 비밀번호 변경
router.put("/me/password", verifyToken, userController.updateMyPassword);

// [API] 회원 역할 변경 (관리자 권한)
router.put("/:id/role", verifyToken, isAdmin, userController.updateUserRole);

// 마이페이지에서 본인 탈퇴 요청
router.delete("/me", verifyToken, userController.deleteMe);

// 관리자 특정 유저 삭제
router.delete("/:id", verifyToken, isAdmin, userController.deleteUser);

// 학생 상태 변경
router.put("/:id/status", verifyToken, isAdmin, userController.updateUserStatus)


export default router;
