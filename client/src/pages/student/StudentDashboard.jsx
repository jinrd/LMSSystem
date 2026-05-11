/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, Clock, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState(() => {
    const name = localStorage.getItem("userName") || "수강생";
    return { name, email: "" };
  });

  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-start mb-10 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              내 학습 대시보드
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              환영합니다, <span className="text-blue-600 font-bold">{studentInfo.name}</span>님! 오늘도 즐거운 학습 되세요.
            </p>
          </div>
          {/* <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button> */}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* 통계 카드 1 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-blue-500 group-hover:to-blue-600 transition-colors duration-300">
              <BookOpen className="text-blue-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">수강 중인 강의</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">3<span className="text-lg font-bold text-slate-400 ml-1">개</span></p>
            </div>
          </div>

          {/* 통계 카드 2 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl group-hover:from-indigo-500 group-hover:to-indigo-600 transition-colors duration-300">
              <Calendar className="text-indigo-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">이번 주 수업</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">5<span className="text-lg font-bold text-slate-400 ml-1">개</span></p>
            </div>
          </div>

          {/* 통계 카드 3 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-purple-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl group-hover:from-purple-500 group-hover:to-purple-600 transition-colors duration-300">
              <Clock className="text-purple-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-purple-600 transition-colors">출석률</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">98<span className="text-lg font-bold text-slate-400 ml-1">%</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center transition-all duration-300 hover:shadow-md">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <BookOpen className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              현재 공지사항이 없습니다.
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              새로운 강의 소식이나 학원 공지가 올라오면 이곳에서 확인하실 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
