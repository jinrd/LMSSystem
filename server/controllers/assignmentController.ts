import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import assignmentService from "../services/assignmentService";

// 1. 과제 출제 (선생님 전용)
const createAssignment = catchAsync(async (req: any, res: Response) => {
    const classId = parseInt(req.params.classId as string);
    const instructorId = req.user.userId;
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        throw new AppError("과제 제목, 내용, 마감일을 모두 입력해주세요.", 400);
    }

    const assignment = await assignmentService.createAssignment(classId, instructorId, req.body);

    res.status(201).json({ message: "과제가 성공적으로 출제되었습니다.", assignment });
});

// 2. 해당 강의의 과제 목록 조회 (공통)
const getAssignmentsByClass = catchAsync(async (req: any, res: Response) => {
    const classId = parseInt(req.params.classId as string);
    const userId = req.user.userId;
    const role = req.user.role;

    const assignments = await assignmentService.getAssignmentsByClass(classId, userId, role);

    res.json(assignments);
});

// 3. 학생 과제 제출 (파일 업로드 포함)
const submitAssignment = catchAsync(async (req: any, res: Response) => {
    const assignmentId = parseInt(req.params.assignmentId as string);
    const studentId = req.user.userId;
    const content = req.body.content;
    const fileUrl = req.file ? `uploads/${req.file.filename}` : null;

    if (!content && !fileUrl) {
        throw new AppError("내용을 입력하거나 파일을 첨부해주세요.", 400);
    }

    const submission = await assignmentService.submitAssignment(assignmentId, studentId, content, fileUrl);

    res.status(201).json({ message: "과제가 제출되었습니다.", submission });
});

// 4. 특정 과제의 제출물 목록 조회 (선생님 전용)
const getSubmissions = catchAsync(async (req: any, res: Response) => {
    const assignmentId = parseInt(req.params.assignmentId as string);
    const instructorId = req.user.userId;

    const submissions = await assignmentService.getSubmissions(assignmentId, instructorId);

    res.json(submissions);
});

// 5. 과제 채점 (선생님 전용)
const gradeSubmission = catchAsync(async (req: any, res: Response) => {
    const submissionId = parseInt(req.params.submissionId as string);
    const instructorId = req.user.userId;
    const { score, feedback } = req.body;

    if (score === undefined || score === null) {
        throw new AppError("점수를 입력해주세요.", 400);
    }

    const gradedSubmission = await assignmentService.gradeSubmission(submissionId, instructorId, score, feedback);

    res.json({ message: "채점이 완료되었습니다.", gradedSubmission });
});

export default {
    createAssignment,
    getAssignmentsByClass,
    submitAssignment,
    getSubmissions,
    gradeSubmission
};
