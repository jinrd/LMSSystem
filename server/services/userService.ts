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
      status: true,
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
      status: true,
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

const updateUserStatus = async (id: number, status: string) => {
  // 1. 유효성 검증
  if (!["ACTIVE", "ON_LEAVE"].includes(status)) {
    throw new AppError("유효하지 않은 상태 값입니다. (ACTIVE 또는 ON_LEAVE만 가능)", 400);
  }

  // 에러 발생시 업데이트 방지 (트랜잭션 처리)
  return await prisma.$transaction(async (tx) => {
    // 유저 상태 업데이트 (비밀번호 같은 민감정보는 select 에서 제외하여 반환)
    const updatedUser = await tx.user.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true }
    });
    // 휴학(ON_LEAVE) 처리인 경우, 해당 학생의 모든 수강 기록 즉시 삭제
    if (status === "ON_LEAVE") {
      await tx.enrollment.deleteMany({
        where: { studentId: id }
      })
    }

    return updatedUser;
  });


}

const deleteUser = async (userId: any) => {
  return await prisma.user.delete({
    where: { id: userId }
  })
}

export default {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  updateUserRole,
  deleteUser,
  updateUserStatus,
};
