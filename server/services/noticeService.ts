import prisma from "../prismaClient";
import AppError from "../utils/AppError";

const getNotices = async (page: any, limit: any) => {
  const skip = (page - 1) * limit;

  const [totalCount, notices] = await Promise.all([
    prisma.notice.count(),
    prisma.notice.findMany({
      skip: skip,
      take: limit,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    }),
  ]);

  return { notices, totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page };
};

const createNotice = async (title: any, content: any, authorId: any) => {
  return await prisma.notice.create({
    data: { title, content, authorId },
  });
};

const getNoticeById = async (id: any) => {
  const notice = await prisma.notice.findUnique({
    where: { id },
  });

  if (!notice) {
    throw new AppError("공지사항을 찾을 수 없습니다.", 404);
  }
  return notice;
};

const updateNotice = async (id: any, title: any, content: any) => {
  return await prisma.notice.update({
    where: { id },
    data: { title, content },
  });
};

const deleteNotice = async (id: any) => {
  await prisma.notice.delete({
    where: { id },
  });
};

export default {
  getNotices,
  createNotice,
  getNoticeById,
  updateNotice,
  deleteNotice,
};
