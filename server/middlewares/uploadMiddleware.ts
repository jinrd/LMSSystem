import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

// 과제 제출 파일이 업로드 될 장소
const uploadDir = path.join(__dirname, "../../uploads")

// uploads 폴더가 존재하지 않을 경우 생성하는 방어 로직
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// diskStorage 대신 memoryStorage 사용 (sharp 처리를 위하여)
const storage = multer.memoryStorage();

// 3. 파일 필터링 (선택): 이미지나 특정 파일만 받게 하고 싶을 때 사용
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // 허용
    } else {
        cb(new Error("지원하지 않는 파일 형식입니다. 이미지나 PDF 파일만 업로드 가능합니다.")); // 거부
    }
}

// 이미지 압출 미들웨어
export const compressImage = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    // PDF 파일은 압축 패스
    if (req.file.mimetype === "application/pdf") {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + "_" + req.file.originalname;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, req.file.buffer);
        req.file.filename = filename;
        req.file.path = filepath;
        return next();
    }

    // 이미지 파일인 경우 sharp 로 압축
    try {
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);

        // webp 로 변환하여 용량 극대화(원할시 jpeg 로 변경 가능)
        const filename = uniqueSuffix + "_" + req.file.originalname.split(".")[0] + ".webp";
        const filepath = path.join(uploadDir, filename);

        await sharp(req.file.buffer)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true }) // 최대 크기 제한
            .webp({ quality: 80 }) // 80% 퀄리티로 압축
            .toFile(filepath);


        // 다음 미들웨어나 컨트롤러에서 사용할 수 있도록 req.file 정보 갱신
        req.file.filename = filename;
        req.file.path = filepath;
        req.file.mimetype = "image/webp";

        next();

    } catch (error) {
        console.error("이미지 압축 에러:", error);
        next(error);
    }
}

// 저장소(Storage) 세팅: 어디에, 어떤 이름으로 저장할지 정합니다.
// const storage = multer.diskStorage({
//     // 저장 목적지 지정
//     destination: (req, file, cb) => {
//         cb(null, uploadDir)
//     },
//     // 파일 이름이 중복되지 않도록 시간 + 원본 이름 + 제출자 이름 + 과제명 (예정)
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9)
//         cb(null, uniqueSuffix + "_" + file.originalname)
//     }
// })

export const upload = multer({
    storage: storage
    , fileFilter: fileFilter
})
