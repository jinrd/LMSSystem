const express = require("express");
const prisma = require("../prismaClient");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// 1. 특정 강좌(Class) 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        schedules: true,
        instructor: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    if (!classData)
      return res.status(404).json({ error: "강좌를 찾을 수 없습니다." });

    res.json(classData);
  } catch (error) {
    res.status(500).json({ error: "강좌 상세 조회 실패" });
  }
});

// 2. 새로운 강좌(Class) 개설 및 스케줄 등록 (관리자 전용)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  // 프론트엔드에서 보낼 때 schedules 는 [{dayOfWeek: 1, startTime: "14:00", endTime: "16:00"}, ...] 형태의 배열이어야 합니다.
  const {
    name,
    capacity,
    startDate,
    endDate,
    courseId,
    instructorId,
    schedules,
  } = req.body;

  if (
    !name ||
    !capacity ||
    !startDate ||
    !endDate ||
    !courseId ||
    !instructorId ||
    !schedules
  ) {
    return res.status(400).json({ message: "모든 필수 항목을 입력해주세요." });
  }

  if (Array.isArray(schedules) && schedules.length === 0) {
    return res.status(400).json({
      message: "최소 1개 이상의 요일 및 시간 스케줄을 등록해야 합니다.",
    });
  }

  try {
    // 트랜잭션(Transaction) 사용 : 강좌 생성과 스케줄 생성을 묶어서 처리
    // 둘 중 하나라도 실패하면 전부 취소(Rollback)되어 데이터가 꼬이는 것을 방지
    const newClass = await prisma.$transaction(async (tx) => {
      // 1) 강좌(Cclass) 생성
      const createdClass = await tx.class.create({
        data: {
          name,
          capacity: Number(capacity),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          courseId: courseId,
          instructorId: Number(instructorId),
        },
      });

      // 2) 스케줄 요일별로 쪼개서 생성
      if (schedules && schedules.length) {
        const scheduleData = schedules.map((s) => ({
          dayOfWeek: Number(s.dayOfWeek),
          startTime: s.startTime,
          endTime: s.endTime,
          classId: createdClass.id,
        }));
        // createMany를 통해 한 번에 여러 개의 요일 정보를 저장합니다.
        await tx.classSchedule.createMany({ data: scheduleData });
      }
      return createdClass;
    });

    res
      .status(201)
      .json({ message: "강좌가 성공적으로 개설되었습니다.", class: newClass });
  } catch (error) {
    console.error("[POST /] 강좌 생성 에러:", error);
    res.status(500).json({ error: "강좌 개설 중 오류가 발생했습니다." });
  }
});

// 3. 강좌 삭제 (관리자 전용)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    // 스키마에서 onDelete: Cascade 가 설정되어 있으므로, 강좌를 지우면 해당 요일 정보(schedules)도 자동으로 지워진다.
    await prisma.class.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "강좌가 성공적으로 삭제되었습니다." });
  } catch (error) {
    ("에러 원인 : ", error);
    res.status(500).json({ error: "강좌 삭제 중 오류가 발생했습니다." });
  }
});

// 4. 특정 강좌의 수강생 목록 조회 (관리자 전용)
router.get("/:id/enrollments", verifyToken, isAdmin, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { classId: parseInt(req.params.id) },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "수강생 목록 조회 실패" });
  }
});

// 5. 특정 강좌에 수강생 등록 (관리자 전용)
router.post("/:id/enrollments", verifyToken, isAdmin, async (req, res) => {
  const classId = parseInt(req.params.id);
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "학생 ID를 제공해주세요." });
  }

  try {
    // 1) 강좌 정원 및 현재 등록 인원 확인
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!classData)
      return res.status(404).json({ message: "강좌를 찾을 수 없습니다." });
    if (classData._count.enrollments >= classData.capacity) {
      return res.status(400).json({ message: "수강 정원이 초과되었습니다." });
    }

    // 2) 등록
    const enrollment = await prisma.enrollment.create({
      data: {
        classId: classId,
        studentId: parseInt(studentId),
        status: "ENROLLED",
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ message: "수강생이 등록되었습니다.", enrollment });
  } catch (error) {
    console.error(error);
    // 중복 등록 시 Prisma가 고유 제약 조건 오류(P2002)를 던짐
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "이미 이 강좌에 등록된 학생입니다." });
    }
    res.status(500).json({ error: "수강생 등록 실패" });
  }
});

// 6. 특정 강좌에서 수강생 제거 (관리자 전용)
router.delete(
  "/:id/enrollments/:studentId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    const classId = parseInt(req.params.id);
    const studentId = parseInt(req.params.studentId);

    try {
      await prisma.enrollment.delete({
        where: {
          studentId_classId: {
            studentId: studentId,
            classId: classId,
          },
        },
      });
      res.json({ message: "수강생이 삭제되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "수강생 삭제 실패" });
    }
  },
);

module.exports = router;
