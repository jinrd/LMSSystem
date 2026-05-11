import { Request, Response, NextFunction } from "express";
import courseService from "../services/courseService";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const getCourses = catchAsync(async (req: Request, res: Response) => {
  const courses = await courseService.getCourses();
  res.status(200).json(courses);
});

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    throw new AppError("과목명을 입력해주세요.", 400);
  }

  const newCourse = await courseService.createCourse(title, description);

  res.status(201).json({
    message: "과목이 성공적으로 등록되었습니다.",
    course: newCourse,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updatedCourse = await courseService.updateCourse(id, title, description);
  
  res.status(200).json({
    message: "과목이 수정되었습니다.",
    course: updatedCourse,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await courseService.deleteCourse(id);
  res.status(200).json({ message: "과목이 삭제되었습니다." });
});

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
