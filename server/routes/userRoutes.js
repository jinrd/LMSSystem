const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// [API] 3. 회원 목록 조회 (인증 필요)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role } = req.query; // 쿼리 파라미터에서 role 가져오기

    // 역할 파라미터가 있으면 where 조건 추가
    const whereCondition = role ? { role: role } : {};

    // 비밀번호를 제외한 정보만 가져오기
    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// [API] 내 정보 조회 (접속한 모든 사용자)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user)
      return res.status(401).json({ error: "사용자를 찾을 수 없습니다." });

    res.json(user);
  } catch (error) {
    console.error("내 정보 조회 에러 : " + error);
    res.status(500).json({ error: "내 정보 조회 실패" });
  }
});

// [API] 내 정보 수정(현재는 이름만 수정 가능하도록 구현)
router.put("/me", verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    console.log("name : {}", name);
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "이름을 입력해주세요." });
    }

    const updateUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({
      message: "정보가 성공적으로 수정되었습니다.",
      user: updateUser,
    });
  } catch (error) {
    console.log("내 정보 수정 에러 : " + error);
    res.status(500).json({ error: "정보 수정 실패" });
  }
});

// [API] 비밀번호 변경
router.put("/me/password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "현재 비밀번호와 새 비밀번호를 모두 입력해주세요." });
    }

    // 1. 현재 사용자 가져오기 (비밀번호 확인용)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    // 2. 현재 비밀번호 일치하는지 확인
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
    }

    // 3. 새 비밀번호 해싱 및 저장
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("비밀번호 변경 에러:", error);
    res.status(500).json({ error: "비밀번호 변경에 실패했습니다." });
  }
});

// [API] 회원 역할 변경 (인증 필요, 관리자 권한)
router.put("/:id/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["ADMIN", "TEACHER", "STUDENT"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "유효하지 않은 역할입니다." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return res.json(updatedUser);
  } catch (error) {
    console.error("Update User Role Error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;