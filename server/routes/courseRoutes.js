const express = require("express");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// 1. 모든 과목(Course) 조회 (개설된 반 정보도 같이 가져오기)
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      // 과목을 조회할 때 그 과목에 속한 반(classes)과 담당 강사 정보도 한꺼번에 가져온다.
      include: {
        classes: {
          include: {
            schedules: true,
            instructor: { select: { id: true, name: true, email: true } },
            _count: { select: { enrollments: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("[GET /] 과목 조회 에러:", error);
    res.status(500).json({ error: "과목 목록을 불러오는데 실패했습니다." });
  }
});

// 2. 과목 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "과목명을 입력해주세요." });
  }

  try {
    const newCourse = await prisma.course.create({
      data: { title, description },
    });

    res.status(201).json({
      message: "과목이 성공적으로 등록되었습니다.",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ error: "과목 등록 중 서버 오류가 발생했습니다." });
  }
});

// 3. 과목 수정 (관리자 전용)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { title, description },
    });
    res.status(200).json({
      message: "과목이 수정되었습니다.",
      courrse: updatedCourse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "과목 수정 실패 또는 존재하지 않는 과목입니다." });
  }
});

// 4. 과목 삭제
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.course.delete({ where: { id } });
    res.status(200).json({ message: "과목이 삭제되었습니다." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "과목 삭제 실패 또는 존재하지 않는 과목입니다." });
  }
});

module.exports = router;
