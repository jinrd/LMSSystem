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
  const { name } = req.body;
  if (!name || name.trim() === "") {
    throw new AppError("이름을 입력해주세요.", 400);
  }

  const updatedUser = await userService.updateMe(req.user.userId, name);
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

export default {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  updateUserRole,
};
