import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient";


export const createInquiry = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { title, content } = req.body;
        const studentId = req.user.userId;

        const newInquiry = await prisma.inquiry.create({
            data: { title, content, studentId }
        })

        res.status(201).json({ success: true, inquiry: newInquiry })

    } catch (error) {
        next(error)
    }
}

export const getInquiries = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { role, userId } = req.user;

        let inquiries;
        if (role === "STUDENT") {
            // 학생은 자신의 문의만 확인
            inquiries = await prisma.inquiry.findMany({
                where: { studentId: userId },
                include: { answeredBy: { select: { name: true } } },
                orderBy: { createdAt: "desc" }
            });
        } else {
            // 강사 및 관리자는 전체 문의 확인
            inquiries = await prisma.inquiry.findMany({
                include: { student: { select: { name: true, email: true } }, answeredBy: { select: { name: true } } },
                orderBy: { createdAt: "desc" }
            });
        }
        res.status(200).json({ success: true, inquiries })
    } catch (error) {
        next(error)
    }
}

export const answerInquiry = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; // 문의 ID
        const { answer } = req.body;
        const answeredById = req.user.userId;
        const updatedInquiry = await prisma.inquiry.update({
            where: { id: Number(id) },
            data: {
                answer,
                answeredById,
                answeredAt: new Date(),
                status: "ANSWERED"
            }
        });
        res.status(200).json({ success: true, inquiry: updatedInquiry });
    } catch (error) {
        next(error);
    }
};


export default {
    createInquiry,
    getInquiries,
    answerInquiry
}