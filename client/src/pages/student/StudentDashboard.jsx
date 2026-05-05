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

  // useEffect(() => {
  //   const name = localStorage.getItem("userName") || "수강생";
  //   setStudentInfo({ name, email: "" });
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              내 학습 대시보드
            </h1>
            <p className="text-slate-500 mt-2">
              환영합니다, {studentInfo.name}님! 오늘도 즐거운 학습 되세요.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 통계 카드 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">수강 중인 강의</p>
              <p className="text-2xl font-bold text-slate-800">3개</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="text-green-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">이번 주 수업</p>
              <p className="text-2xl font-bold text-slate-800">5개</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="text-purple-600 h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">출석률</p>
              <p className="text-2xl font-bold text-slate-800">98%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              현재 공지사항이 없습니다.
            </h3>
            <p className="text-slate-500">
              새로운 강의 소식이나 학원 공지가 올라오면 이곳에서 확인하실 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
