import prisma from "../prismaClient";

const getCourses = async () => {
  return await prisma.course.findMany({
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
};

const createCourse = async (title: any, description: any) => {
  return await prisma.course.create({
    data: { title, description },
  });
};

const updateCourse = async (id: any, title: any, description: any) => {
  return await prisma.course.update({
    where: { id },
    data: { title, description },
  });
};

const deleteCourse = async (id: any) => {
  await prisma.course.delete({ where: { id } });
};

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
