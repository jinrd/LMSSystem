import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient";

// 관리자용 전체 에러 및 시스템 로그 조회
export const getSystemLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await prisma.systemLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 100 // 최근 100개까지만 가져오기
        });
        res.status(200).json({ success: true, logs });
    } catch (error) {
        next(error);
    }
};

export default {
    getSystemLogs
};
