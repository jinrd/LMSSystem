import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, CalendarDays, Bell, LogOut } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // 관리자(ADMIN)용 사이드바 메뉴
  const adminMenus = [
    { name: "대시보드", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "유저 관리", path: "/admin/users", icon: <Users size={20} /> },
    { name: "교육과정 관리", path: "/admin/courses", icon: <BookOpen size={20} /> },
    { name: "전체 스케줄", path: "/admin/schedule", icon: <CalendarDays size={20} /> },
    { name: "공지사항", path: "/notices", icon: <Bell size={20} /> },
  ];

  // 학생(STUDENT)용 사이드바 메뉴
  const studentMenus = [
    { name: "나의 강의실", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "공지사항", path: "/notices", icon: <Bell size={20} /> },
  ];

  // 권한에 따라 보여줄 메뉴 결정
  const menus = role === "ADMIN" ? adminMenus : studentMenus;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. 좌측 사이드바 영역 */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-2xl font-black tracking-wider">LMS System</h1>
          <p className="text-indigo-300 text-sm mt-1">
            {role === "ADMIN" ? "원장님 환영합니다" : "학생 환영합니다"}
          </p>
        </div>
        
        {/* 메뉴 리스트 */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menus.map((menu) => {
            const isActive = location.pathname.includes(menu.path);
            return (
              <Link
                key={menu.name}
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-indigo-600 text-white font-bold shadow-md" : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                }`}
              >
                {menu.icon}
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 로그아웃 버튼 */}
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 2. 우측 메인 콘텐츠 영역 (메뉴를 클릭하면 이 부분만 바뀜) */}
      <main className="flex-1 overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
}