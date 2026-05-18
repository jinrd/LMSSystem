import prisma from "../prismaClient";
import AppError from "../utils/AppError";

// 과제 출제
const createAssignment = async (classId: any, instructorId: any, data: any, role?: string) => {
    const { title, description, dueDate } = data;

    const selectClass = await prisma.class.findUnique({ where: { id: classId } })

    if (!selectClass) {
        throw new AppError("선택하신 강의를 찾을 수 없습니다.", 404)
    }

    if (role !== "ADMIN" && selectClass.instructorId !== instructorId) {
        throw new AppError("본인이 담당하는 반에만 과제를 출제할 수 있습니다.", 403)
    }

    const newAssignment = await prisma.assignment.create({
        data: {
            title,
            description,
            dueDate: new Date(dueDate),
            classId
        }
    })

    // 이걸 사용하는 이유는 인자로 받은 data 를 그대로 사용하기 위함인가?
    // prisma.assignment.create({ data: { ...data, classId } })
    // 네 맞습니다! 스프레드 연산자를 사용하면 코드를 더 간결하게 작성할 수 있습니다.
    // 하지만 날짜 포맷 변환(new Date) 같은 전처리가 필요할 때는 명시적으로 적어주는 것이 좋습니다.

    return newAssignment;
}

// 반별 과제 목록 조회
const getAssignmentsByClass = async (classId: any, userId: any, role: any) => {

    const assignments = await prisma.assignment.findMany({
        where: { classId },
        orderBy: { createdAt: "desc" },
        include: role === "STUDENT" ? {
            submissions: {
                where: { studentId: userId }
            }
        } : undefined
    })

    return assignments
}

// 과제 제출
const submitAssignment = async (assignmentId: any, studentId: any, content: any, fileUrl: any) => {

    // 제출 과제가 있는지 확인
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId }
    })

    if (!assignment) {
        throw new AppError("제출할 과제가 존재하지 않습니다.", 404)
    }

    // 만료 기한 검증
    if (assignment.dueDate < new Date()) {
        throw new AppError("제출 기한이 지났습니다.", 400);
    }

    // 중복 제출 검사
    let submission = await prisma.submission.findUnique({
        where: { assignmentId_studentId: { assignmentId, studentId } }
    })

    // 제출 기록이 있으므로 덮어쓰기
    if (submission) {
        submission = await prisma.submission.update({
            where: { assignmentId_studentId: { assignmentId, studentId } },
            data: {
                content,
                fileUrl,
            }
        })
    } else {
        submission = await prisma.submission.create({
            data: {
                assignmentId,
                studentId,
                content,
                fileUrl,
            }
        })
    }

    return submission;

}

// 특정 과제의 학생 제출 목록 조회
const getSubmissions = async (assignmentId: any, instructorId: any, role?: string) => {
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: { class: true }
    })

    if (!assignment) {
         throw new AppError("과제를 찾을 수 없습니다.", 404);
    }

    if (role !== "ADMIN" && assignment.class.instructorId !== instructorId) {
        throw new AppError("담당한 과목이 아닙니다.", 403);
    }

    const submissions = await prisma.submission.findMany({
        where: { assignmentId },
        include: {
            student: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return submissions

}

// 과제 채점
const gradeSubmission = async (submissionId: any, instructorId: any, score: any, feedback: any, role?: string) => {
    // 1. 제출물과 해당 과제의 담당 강사 정보 조회
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
            assignment: {
                include: { class: true }
            }
        }
    });

    if (!submission) {
        throw new AppError("제출된 과제를 찾을 수 없습니다.", 404);
    }

    // 2. 권한 검증: 이 제출물이 속한 반의 강사가 요청한 사람이 맞는지 확인 (ADMIN은 예외)
    if (role !== "ADMIN" && submission.assignment.class.instructorId !== instructorId) {
        throw new AppError("해당 과제를 채점할 권한이 없습니다.", 403);
    }

    // 3. 점수와 피드백 업데이트 (상태도 GRADED로 변경)
    const gradedSubmission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
            score: Number(score),
            feedback,
            status: "GRADED"
        }
    });

    return gradedSubmission;
};
export default {
    createAssignment,
    getAssignmentsByClass,
    submitAssignment,
    getSubmissions,
    gradeSubmission
};