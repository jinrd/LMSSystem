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
  const { name, capacity, startDate, endDate, courseId, instructorId, schedules } = data;

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

export default {
  getClassById,
  createClass,
  deleteClass,
  getEnrollments,
  enrollStudent,
  removeStudent,
};
