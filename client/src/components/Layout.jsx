/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  Bell,
  LogOut,
  UserCircle,
  MessageSquare,
  Activity
} from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const adminMenus = [
    {
      name: "대시보드",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "유저 관리", path: "/admin/users", icon: <Users size={20} /> },
    {
      name: "교육과정 관리",
      path: "/admin/courses",
      icon: <BookOpen size={20} />,
    },
    {
      name: "전체 스케줄",
      path: "/admin/schedule",
      icon: <CalendarDays size={20} />,
    },
    { name: "1:1 문의 관리", path: "/admin/inquiries", icon: <MessageSquare size={20} /> },
    { name: "시스템 로그", path: "/admin/system-logs", icon: <Activity size={20} /> },
    { name: "공지사항", path: "/notices", icon: <Bell size={20} /> },
    { name: "마이페이지", path: "/mypage", icon: <UserCircle size={20} /> },
  ];

  const studentMenus = [
    {
      name: "나의 강의실",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "1:1 문의", path: "/student/inquiries", icon: <MessageSquare size={20} /> },
    { name: "공지사항", path: "/notices", icon: <Bell size={20} /> },
    { name: "마이페이지", path: "/mypage", icon: <UserCircle size={20} /> },
  ];

  const teacherMenus = [
    {
      name: "대시보드",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "1:1 문의 관리", path: "/admin/inquiries", icon: <MessageSquare size={20} /> },
    { name: "공지사항", path: "/notices", icon: <Bell size={20} /> },
    { name: "마이페이지", path: "/mypage", icon: <UserCircle size={20} /> },
  ];

  const menus =
    role === "ADMIN"
      ? adminMenus
      : role === "TEACHER"
        ? teacherMenus
        : studentMenus;

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      {/* 프리미엄 사이드바: 글래스모피즘 + 짙은 그라데이션 */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col border-r border-slate-800/50 shadow-[4px_0_24px_rgba(0,0,0,0.15)] relative z-20">
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-black tracking-tight text-gradient-light mb-1">
            LMS System
          </h1>
          <p className="text-indigo-200/70 text-sm font-medium">
            {role === "ADMIN"
              ? "원장님 환영합니다"
              : role === "TEACHER"
                ? "선생님 환영합니다."
                : "학생 환영합니다"}
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menus.map((menu) => {
            const isActive = location.pathname.includes(menu.path);
            return (
              <Link
                key={menu.name}
                to={menu.path}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 ease-out group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/25 font-semibold"
                    : "text-indigo-200/80 hover:bg-white/10 hover:text-white hover:shadow-sm"
                }`}
              >
                <div
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                >
                  {menu.icon}
                </div>
                <span className="tracking-wide">{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-3.5 text-indigo-200/80 hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-300 group hover:shadow-sm"
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium tracking-wide">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
