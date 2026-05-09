const express = require("express");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// [API] 3. 회원 목록 조회 (인증 필요)
// 앞서 server.js에 설정한 기본 경로가 /api/users 이므로, 여기서는 '/' 경로를 사용합니다.
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    // 비밀번호를 제외한 정보만 가져오기
    const users = await prisma.user.findMany({
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
