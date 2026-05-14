import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"

// 과제 제출 파일이 업로드 될 장소
const uploadDir = path.join(__dirname, "../../uploads")

// uploads 폴더가 존재하지 않을 경우 생성하는 방어 로직
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// 저장소(Storage) 세팅: 어디에, 어떤 이름으로 저장할지 정합니다.
const storage = multer.diskStorage({
    // 저장 목적지 지정
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    // 파일 이름이 중복되지 않도록 시간 + 원본 이름 + 제출자 이름 + 과제명 (예정)
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + "_" + file.originalname)
    }
})

// 3. 파일 필터링 (선택): 이미지나 특정 파일만 받게 하고 싶을 때 사용
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // 허용
    } else {
        cb(new Error("지원하지 않는 파일 형식입니다. 이미지나 PDF 파일만 업로드 가능합니다.")); // 거부
    }
}


export const upload = multer({
    storage: storage
    , fileFilter: fileFilter
})
