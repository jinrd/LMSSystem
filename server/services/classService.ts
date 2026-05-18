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

const getStudentDashboardStatus = async (studentId: number) => {
  // 학생이 수강 등록한 강의 목록 조회
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          course: { select: { title: true } },
          instructor: { select: { name: true } }
        }
      }

    }
  })

  const totalClasses = enrollments.length;

  // 당일 스케줄 체크
  const today = new Date().getDay();

  const enrolledClassIds = enrollments.map(e => e.classId);

  const todaySchedulesData = await prisma.classSchedule.findMany({
    where: {
      classId: { in: enrolledClassIds },
      dayOfWeek: today
    },
    include: {
      class: {
        select: {
          name: true,
          instructor: { select: { name: true } }
        }
      }
    },
    orderBy: { startTime: 'asc' }
  });

  const todaySchedulesList = todaySchedulesData.map((sch => ({
    id: sch.id,
    startTime: sch.startTime,
    endTime: sch.endTime,
    className: sch.class.name,
    instructorName: sch.class.instructor.name,
  })));

  const classList = enrollments.map(e => ({
    id: e.class.id,
    name: e.class.name,
    courseTitle: e.class.course.title,
    instructorName: e.class.instructor.name,
    startDate: e.class.startDate,
    endDate: e.class.endDate,
  }))

  return {
    totalClasses,
    todaySchedules: todaySchedulesList.length,
    todaySchedulesList,
    classes: classList
  };

}

const getStudentClassDetail = async (classId: number, studentId: number) => {
  // 학생이 해당 강의를 듣고 있는지 검증 및 조회
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_classId: {
        studentId, classId
      },
    },
    include: {
      class: {
        include: {
          course: { select: { title: true, description: true } },
          instructor: { select: { name: true, email: true } }
        }
      }
    }
  })

  // 수강하지 않는 강의는 null 반환
  if (!enrollment) return null;

  return {
    classInfo: {
      id: enrollment.class.id,
      name: enrollment.class.name,
      startDate: enrollment.class.startDate,
      endDate: enrollment.class.endDate,
      courseTitle: enrollment.class.course.title,
      courseDescription: enrollment.class.course.description,
      instructorName: enrollment.class.instructor.name,
      instructorEmail: enrollment.class.instructor.email,
    },
    myEnrollment: {
      status: enrollment.status,
      createdAt: enrollment.createdAt,
    },
  };
}

const getTeacherClassDetail = async (classId: number, instructorId: number, role?: string) => {
  const classData = await prisma.class.findUnique({
    where: role === "ADMIN" ? { id: classId } : { id: classId, instructorId },
    include: {
      course: { select: { title: true, description: true } },
      instructor: { select: { name: true, email: true } },
      enrollments: {
        include: { student: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!classData) return null;

  return {
    classInfo: {
      id: classData.id,
      name: classData.name,
      startDate: classData.startDate,
      endDate: classData.endDate,
      courseTitle: classData.course.title,
      courseDescription: classData.course.description,
      instructorName: classData.instructor.name,
      instructorEmail: classData.instructor.email,
    },
    enrollments: classData.enrollments,
  };
}

export default {
  getClassById,
  createClass,
  deleteClass,
  getEnrollments,
  enrollStudent,
  removeStudent,
  getTeacherDashboardStatus,
  getStudentDashboardStatus,
  getTeacherClassDetail,
  getStudentClassDetail,
};
