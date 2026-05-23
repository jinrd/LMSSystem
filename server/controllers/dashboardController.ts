import { Request, Response } from "express";
import dashboardService from "../services/dashboardService";
import catchAsync from "../utils/catchAsync";

// 관리자 요약 데이터 조회 컨트롤러
const getAdminSummary = catchAsync(async (req: Request, res: Response) => {
    const summary = await dashboardService.getAdminSummary();

    res.status(200).json({
        message: "대시보드 통계 조회 성공",
        data: summary,
    });
});

export default {
    getAdminSummary,
};
