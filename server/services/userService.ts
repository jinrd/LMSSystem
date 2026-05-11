import bcrypt from "bcrypt";
import prisma from "../prismaClient";
import AppError from "../utils/AppError";

const getUsers = async (role: any) => {
  const whereCondition = role ? { role: role } : {};
  return await prisma.user.findMany({
    where: whereCondition,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMe = async (userId: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
  
  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 401);
  }
  return user;
};

const updateMe = async (userId: any, name: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, email: true, name: true, role: true },
  });
};

const updateMyPassword = async (userId: any, currentPassword: any, newPassword: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("현재 비밀번호가 일치하지 않습니다.", 401);
  }

  const saltRounds = 10;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

const updateUserRole = async (userId: any, role: any) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });
};

export default {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  updateUserRole,
};
