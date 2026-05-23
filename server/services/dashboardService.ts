import prisma from "../prismaClient";

const getAdminSummary = async () => {
    const currentDate = new Date();

    // 1. 주요 통계 데이터 병렬 조회 ( Promise.all 로 속도 최적화 )
    const [totalStudents, totalTeachers, activeClasses, recentStudents, recentNotices] = await Promise.all([
        // 총 재학생 수(휴학생 제외)
        prisma.user.count({
            where: { role: "STUDENT", status: "ACTIVE" }
        }),
        // 총 강사 수
        prisma.user.count({
            where: { role: "TEACHER" }
        }),
        // 현재 진행 중인 반 수 (종강일이 오늘 이후인 반)
        prisma.class.count({
            where: { endDate: { gte: currentDate } }
        }),
        // 최근 가입한 학생 5명
        prisma.user.findMany({
            where: { role: "STUDENT" },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                status: true,
            },
        }),
        // 최근 등록된 공지사항 5개
        prisma.notice.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
        })
    ]);
    return {
        stats: {
            totalStudents,
            totalTeachers,
            activeClasses,
        },
        recentStudents,
        recentNotices,
    };
}
export default {
    getAdminSummary,
};