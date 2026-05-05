const express = require("express");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// 모든 요청에 대한 로깅 미들웨어 (이 라우터 내에서만 작동)
router.use((req, res, next) => {
  console.log(`[CourseRoutes] ${req.method} ${req.url}`);
  next();
});

// 1. 모든 강의 조회
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log(`[GET /] 조회 성공: ${courses.length}개`);
    res.status(200).json(courses);
  } catch (error) {
    console.error("[GET /] 조회 에러:", error);
    res.status(500).json({ error: "강의 목록을 불러오는데 실패했습니다." });
  }
});

// 2. 강의 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  console.log("--- [POST /] 강의 등록 시도 ---");
  console.log("요청 바디:", req.body);

  const { title, instructor, capacity } = req.body;

  if (!title || !instructor || !capacity) {
    console.log("[POST /] 실패: 필수 데이터 누락");
    return res.status(400).json({
      message: "모든 필수 항목(강의명, 강사명, 정원)을 입력해주세요.",
    });
  }

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        instructor,
        capacity: Number(capacity),
      },
    });

    console.log("[POST /] 성공: 새 강의 생성됨 -> ID:", newCourse.id);
    return res.status(201).json({
      message: "강의가 성공적으로 등록되었습니다.",
      course: newCourse
    });
  } catch (error) {
    console.error("[POST /] 에러 상세:", error);
    return res
      .status(500)
      .json({ error: "강의 등록 중 서버 오류가 발생했습니다." });
  }
});

// 3. 강의 수정 (관리자 전용)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, instructor, capacity } = req.body;
  console.log(`--- [PUT /${id}] 강의 수정 시도 ---`);

  try {
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: { title, instructor, capacity: Number(capacity) },
    });

    console.log(`[PUT /${id}] 수정 성공`);
    return res.status(200).json({
      message: "강의가 수정되었습니다.",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(`[PUT /${id}] 수정 에러:`, error);
    return res.status(500).json({
      message: "강의 수정 실패 또는 존재하지 않는 강의입니다.",
    });
  }
});

// 4. 강의 삭제 (관리자 전용)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  console.log(`--- [DELETE /${id}] 강의 삭제 시도 ---`);

  try {
    await prisma.course.delete({ where: { id } });
    console.log(`[DELETE /${id}] 삭제 성공`);
    return res.status(200).json({ message: "강의가 삭제되었습니다." });
  } catch (error) {
    console.error(`[DELETE /${id}] 삭제 에러:`, error);
    return res.status(500).json({
      message: "강의 삭제 실패 또는 존재하지 않는 강의입니다.",
    });
  }
});

module.exports = router;
