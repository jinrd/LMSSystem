import classController from "../controllers/classController";
import prisma from "../prismaClient";
import AppError from "../utils/AppError";

const getClassById = async (id: any) => {
  const classData = await prisma.class.findUnique({
    where: { id },
    include: {
      schedules: true,
      instructor: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true } },
    },
  });

  if (!classData) {
    throw new AppError("강좌를 찾을 수 없습니다.", 404);
  }
  return classData;
};

const createClass = async (data: any) => {
  const {
    name,
    capacity,
    startDate,
    endDate,
    courseId,
    instructorId,
    schedules,
  } = data;

  return await prisma.$transaction(async (tx: any) => {
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

    if (schedules && schedules.length) {
      const scheduleData = schedules.map((s: any) => ({
        dayOfWeek: Number(s.dayOfWeek),
        startTime: s.startTime,
        endTime: s.endTime,
        classId: createdClass.id,
      }));
      await tx.classSchedule.createMany({ data: scheduleData });
    }
    return createdClass;
  });
};

const deleteClass = async (id: any) => {
  await prisma.class.delete({
    where: { id },
  });
};

const getEnrollments = async (classId: any) => {
  return await prisma.enrollment.findMany({
    where: { classId },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const enrollStudent = async (classId: any, studentId: any) => {
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: { _count: { select: { enrollments: true } } },
  });

  if (!classData) {
    throw new AppError("강좌를 찾을 수 없습니다.", 404);
  }
  if (classData._count.enrollments >= classData.capacity) {
    throw new AppError("수강 정원이 초과되었습니다.", 400);
  }

  return await prisma.enrollment.create({
    data: {
      classId,
      studentId: parseInt(studentId),
      status: "ENROLLED",
    },
    include: {
      student: { select: { id: true, name: true, email: true } },
    },
  });
};

const removeStudent = async (classId: any, studentId: any) => {
  await prisma.enrollment.delete({
    where: {
      studentId_classId: {
        studentId,
        classId,
      },
    },
  });
};

// 선생님 DashBoard 에서 사용할 함수 조회
const getTeacherDashboardStatus = async (instructorId: number) => {
  // 1. 담당중인 반(class) 목록과 각 반의 수강생 수(_count) 조회
  const classes = await prisma.class.findMany({
    where: { instructorId },
    include: {
      course: { select: { title: true } }, // 부모 과목의 타이틀 가져오기
      _count: {
        select: { enrollments: true },
      },
    },
  });

  const totalClasses = classes.length;

  // 2. 총 관리 수강생 수 합산
  const totalStudents = classes.reduce(
    (sum: number, cls: any) => sum + cls._count.enrollments,
    0,
  );

  // 3. 오늘 예정된 수업 수 계산(0: 일요일 ~ 6: 토요일)
  const today = new Date().getDay();
  const todayScedulesData = await prisma.classSchedule.findMany({
    where: {
      class: { instructorId },
      dayOfWeek: today,
    },
    include: {
      class: {
        select: {
          name: true,
          _count: { select: { enrollments: true } }
        }
      }
    },
    orderBy: { startTime: "asc" } // 시간순 정렬
  });

  const todaySchedulesList = todayScedulesData.map((sch) => ({
    id: sch.id,
    startTime: sch.startTime,
    endTime: sch.endTime,
    className: sch.class.name,
    enrolledCount: sch.class._count.enrollments,
  }))

  // 4. 담당 강의 상세 정보 배열 가공
  const classList = classes.map((cls) => ({
    id: cls.id,
    name: cls.name,
    courseTitle: cls.course.title,
    capacity: cls.capacity,
    enrolledCount: cls._count.enrollments,
    startDate: cls.startDate,
    endDate: cls.endDate,
  }));

  return {
    totalClasses,
    totalStudents,
    todaySchedules: todayScedulesData.length,
    todaySchedulesList,
    classes: classList,
  };
};

export default {
  getClassById,
  createClass,
  deleteClass,
  getEnrollments,
  enrollStudent,
  removeStudent,
  getTeacherDashboardStatus,
};
