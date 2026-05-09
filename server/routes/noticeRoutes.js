const express = require("express");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// [API] 공지사항 목록 조회 (페이징 적용, 누구나 접근 가능하되 로그인(verifyToken)은 필요)
router.get("/", verifyToken, async (req, res) => {
  try {
    // 쿼리 파라미터에서 page 와 limit 을 가져옴 (기본값 : page = 1 , limit = 20)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 총 게시글 수와 페이지에 맞는 데이터 조회
    const [totalCount, notices] = await Promise.all([
      prisma.notice.count(),
      prisma.notice.findMany({
        skip: skip,
        take: limit,
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      }),
    ]);

    res.json({
      notices: notices,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: "공지사항 조회 실패" });
  }
});

// [API] 공지사항 등록, (원장 전용: isAdmin 미들웨어 사용)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.userId;

    const newNotice = await prisma.notice.create({
      data: { title, content, authorId },
    });
    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ error: "공지사항 등록 실패" });
  }
});

// [API] 공지사항 상세 조회
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!notice)
      return res.status(404).json({ error: "공지사항을 찾을 수 없습니다." });

    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: "공지사항 상세 조회 실패" });
  }
});

// [API] 공지사항 수정 (원장 전용: isAdmin 미들웨어 사용)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNotice = await prisma.notice.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content },
    });
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ error: "공지사항 수정 실패" });
  }
});

// [API] 공지사항 삭제 (원장 전용: isAdmin 미들웨어 사용)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await prisma.notice.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "공지사항이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "공지사항 삭제 실패" });
  }
});

module.exports = router;
