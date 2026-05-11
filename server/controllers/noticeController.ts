import { Request, Response, NextFunction } from "express";
import noticeService from "../services/noticeService";
import catchAsync from "../utils/catchAsync";

const getNotices = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string)) || 1;
  const limit = parseInt((req.query.limit as string)) || 20;

  const result = await noticeService.getNotices(page, limit);
  res.json(result);
});

const createNotice = catchAsync(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const authorId = req.user.userId;

  const newNotice = await noticeService.createNotice(title, content, authorId);
  res.status(201).json(newNotice);
});

const getNoticeById = catchAsync(async (req: Request, res: Response) => {
  const notice = await noticeService.getNoticeById(parseInt((req.params.id as string)));
  res.json(notice);
});

const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const updatedNotice = await noticeService.updateNotice(parseInt((req.params.id as string)), title, content);
  res.json(updatedNotice);
});

const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  await noticeService.deleteNotice(parseInt((req.params.id as string)));
  res.json({ message: "공지사항이 삭제되었습니다." });
});

export default {
  getNotices,
  createNotice,
  getNoticeById,
  updateNotice,
  deleteNotice,
};
