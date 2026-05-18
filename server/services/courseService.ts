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
  console.log("id : " + id);
  
  // 1. 과목(Course)에 속한 모든 강좌(Class)를 먼저 삭제합니다.
  // (하위 데이터인 수강내역, 과제 등은 DB의 Cascade 설정에 의해 함께 삭제됩니다)
  await prisma.class.deleteMany({
    where: { courseId: id }
  });

  // 2. 그 다음 과목(Course)을 삭제합니다.
  await prisma.course.delete({ where: { id } });
};

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
