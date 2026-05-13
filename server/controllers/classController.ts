import { Request, Response, NextFunction } from "express";
import classService from "../services/classService";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const getClassById = catchAsync(async (req: Request, res: Response) => {
  const classData = await classService.getClassById(
    parseInt(req.params.id as string),
  );
  res.json(classData);
});

const createClass = catchAsync(async (req: Request, res: Response) => {
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
    throw new AppError("모든 필수 항목을 입력해주세요.", 400);
  }

  if (Array.isArray(schedules) && schedules.length === 0) {
    throw new AppError(
      "최소 1개 이상의 요일 및 시간 스케줄을 등록해야 합니다.",
      400,
    );
  }

  const newClass = await classService.createClass({
    name,
    capacity,
    startDate,
    endDate,
    courseId,
    instructorId,
    schedules,
  });

  res
    .status(201)
    .json({ message: "강좌가 성공적으로 개설되었습니다.", class: newClass });
});

const deleteClass = catchAsync(async (req: Request, res: Response) => {
  await classService.deleteClass(parseInt(req.params.id as string));
  res.json({ message: "강좌가 성공적으로 삭제되었습니다." });
});

const getEnrollments = catchAsync(async (req: Request, res: Response) => {
  const enrollments = await classService.getEnrollments(
    parseInt(req.params.id as string),
  );
  res.json(enrollments);
});

const enrollStudent = catchAsync(async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id as string);
  const { studentId } = req.body;

  if (!studentId) {
    throw new AppError("학생 ID를 제공해주세요.", 400);
  }

  const enrollment = await classService.enrollStudent(classId, studentId);
  res.status(201).json({ message: "수강생이 등록되었습니다.", enrollment });
});

const removeStudent = catchAsync(async (req: Request, res: Response) => {
  const classId = parseInt(req.params.id as string);
  const studentId = parseInt(req.params.studentId as string);

  await classService.removeStudent(classId, studentId);
  res.json({ message: "수강생이 삭제되었습니다." });
});

const getTeacherStatus = catchAsync(async (req: any, res: Response) => {
  const instructorId = req.user.userId; // 토큰에서 추출한 강사 ID를 (기존 id -> userId 로 수정)
  if (!instructorId) {
    throw new AppError("인증 정보가 없습니다.", 401);
  }

  const status = await classService.getTeacherDashboardStatus(instructorId);
  res.json(status);
});

const getTeacherClassDetail = catchAsync(async (req: any, res: Response) => {
  const classId = parseInt(req.params.id);
  const instructorId = req.user.userId;

  const detail = await classService.getTeacherClassDetail(classId, instructorId);

  if (!detail) {
    throw new AppError("본인이 담당하는 강좌가 아니거나 강좌를 찾을 수 없습니다.", 403);
  }

  res.json(detail);
});

const getStudentStatus = catchAsync(async (req: any, res: Response) => {
  const studentId = req.user.userId;
  if (!studentId) {
    throw new AppError("인증 정보가 없습니다.", 401);
  }

  const status = await classService.getStudentDashboardStatus(studentId);
  res.json(status);
});

const getStudentClassDetail = catchAsync(async (req: any, res: Response) => {
  const classId = parseInt(req.params.id);
  const studentId = req.user.userId;

  const detail = await classService.getStudentClassDetail(classId, studentId);

  if (!detail) {
    throw new AppError("수강 중인 강의가 아니거나 권한이 없습니다.", 403);
  }

  res.json(detail);
})

export default {
  getClassById,
  createClass,
  deleteClass,
  getEnrollments,
  enrollStudent,
  removeStudent,
  getTeacherStatus,
  getTeacherClassDetail,
  getStudentStatus,
  getStudentClassDetail
};
