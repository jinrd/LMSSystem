class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // 프로그래밍 로직상 예측 가능한 에러인지 체크
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
