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
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

module.exports = router;
