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

const getTeacherClassEnrollments = catchAsync(async (req: any, res: Response) => {
  const classId = parseInt(req.params.id as string);
  const instructorId = req.user.userId;

  // 해당 강의 정보 조회(classService 의 기본 함수 재사용)
  const classData = await classService.getClassById(classId);

  if (!classData) {
    throw new AppError("존재하지 않는 강의입니다.", 404);
  }

  // 본인이 담당하는 강의인지 권한체크
  if (classData.instructorId !== instructorId) {
    throw new AppError("자신이 담당하는 강의만 조회할 수 있습니다.", 403);
  }

  // 해당 강의 수강생 목록 조회
  const enrollments = await classService.getEnrollments(classId);

  res.json({
    classInfo: classData,
    enrollments,
  });
})

export default {
  getClassById,
  createClass,
  deleteClass,
  getEnrollments,
  enrollStudent,
  removeStudent,
  getTeacherStatus,
  getTeacherClassEnrollments
};
