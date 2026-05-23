import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.query;
  const users = await userService.getUsers(role);
  res.json(users);
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user.userId);
  res.json(user);
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { name, phone } = req.body;
  if (!name || name.trim() === "") {
    throw new AppError("이름을 입력해주세요.", 400);
  }

  const updatedUser = await userService.updateMe(req.user.userId, name, phone);
  res.json({
    message: "정보가 성공적으로 수정되었습니다.",
    user: updatedUser,
  });
});

const updateMyPassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new AppError("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.", 400);
  }

  await userService.updateMyPassword(req.user.userId, currentPassword, newPassword);
  res.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["ADMIN", "TEACHER", "STUDENT"];
  if (!validRoles.includes(role)) {
    throw new AppError("유효하지 않은 역할입니다.", 400);
  }

  const updatedUser = await userService.updateUserRole(parseInt(id as string, 10), role);
  res.json(updatedUser);
});

const deleteMe = catchAsync(async (req: any, res: Response) => {
  const userId = parseInt(req.user.userId);

  await userService.deleteUser(userId);

  res.json({ message: "회원 탈퇴 처리가 완료되었습니다." })
})

const deleteUser = catchAsync(async (req: any, res: Response) => {
  const userId = parseInt(req.params.id);
  await userService.deleteUser(userId);
  res.json({ message: "사용자가 삭제되었습니다." })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || isNaN(Number(id))) {
    throw new AppError("유효하지 않은 사용자 ID입니다.", 400);
  }

  if (!status) {
    throw new AppError("변경할 상태(status) 값이 필요합니다.", 400);
  }

  // 서비스 함수 호출
  const updatedUser = await userService.updateUserStatus(Number(id), status);
  res.json({
    message: status === "ON_LEAVE"
      ? "휴학 처리가 완료되었으며 수강 목록에서 제외되었습니다."
      : "재학(복학) 처리가 완료되었습니다.",
    user: updatedUser
  });
})

export default {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  updateUserRole,
  deleteMe,
  deleteUser,
  updateUserStatus
};
