import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, LogOut, Clock, Bell } from "lucide-react";
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacherInfo, setTeacherInfo] = useState(() => {
    const name = localStorage.getItem("userName") || "강사";
    return { name };
  });

  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todaySchedules: 0,
    todaySchedulesList: [],
    classes: [],
  });

  const [notices, setNotices] = useState([]);

  useEffect(() => {

    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const res = await fetch("http://localhost:5001/api/notices?page=1&limit=3", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const noticesList = Array.isArray(data.notices) ? data.notices : [];
          setNotices(noticesList.slice(0, 3));
        }
      } catch (error) {
        console.error("공지사항을 불러오지 못했습니다.", error);
      }
    }

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const res = await fetch(
          "http://localhost:5001/api/classes/teacher/status",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("통계 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchStatus();
    fetchNotices();

  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        {/* 상단 헤더 영역 */}
        <header className="flex justify-between items-start mb-10 pb-6 border-b border-slate-200/60">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              강의 대시보드
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              안녕하세요,{" "}
              <span className="text-indigo-600 font-bold">
                {teacherInfo.name}
              </span>{" "}
              선생님! 오늘도 힘찬 강의 되세요.
            </p>
          </div>
        </header>
        {/* 프리미엄 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* 통계 카드 1: 담당 중인 반 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl group-hover:from-indigo-500 group-hover:to-indigo-600 transition-colors duration-300">
              <BookOpen className="text-indigo-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                담당 중인 반
              </p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">
                {stats.totalClasses}
                <span className="text-lg font-bold text-slate-400 ml-1">
                  개
                </span>
              </p>
            </div>
          </div>
          {/* 통계 카드 2: 총 수강생 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-emerald-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl group-hover:from-emerald-500 group-hover:to-emerald-600 transition-colors duration-300">
              <Users className="text-emerald-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
                총 관리 수강생
              </p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">
                {stats.totalStudents}
                <span className="text-lg font-bold text-slate-400 ml-1">
                  명
                </span>
              </p>
            </div>
          </div>
          {/* 통계 카드 3: 오늘 예정된 수업 */}
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-orange-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl group-hover:from-orange-500 group-hover:to-orange-600 transition-colors duration-300">
              <Calendar className="text-orange-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-orange-600 transition-colors">
                오늘 예정된 수업
              </p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">
                {stats.todaySchedules}
                <span className="text-lg font-bold text-slate-400 ml-1">
                  건
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 중간 영역: 오늘의 스케줄 & 공지사항 위젯 (새로 추가) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 오늘의 스케줄 상세 타임라인 */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Clock className="text-orange-500 h-6 w-6" /> 오늘의 수업 타임라인
            </h3>
            {stats.todaySchedulesList && stats.todaySchedulesList.length > 0 ? (
              <div className="space-y-4">
                {stats.todaySchedulesList.map((schedule, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <div className="w-24 text-center border-r border-orange-200 pr-4 mr-4">
                      <p className="text-sm font-bold text-orange-600">{schedule.startTime}</p>
                      <p className="text-xs font-semibold text-orange-400">~ {schedule.endTime}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{schedule.className}</h4>
                      <p className="text-sm font-medium text-slate-500 mt-1">수강생 {schedule.enrolledCount}명</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-medium">
                오늘 예정된 수업이 없습니다. 푹 쉬세요! 🎉
              </div>
            )}
          </div>

          {/* 최근 학원 공지사항 */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Bell className="text-indigo-500 h-6 w-6" /> 최근 공지사항
            </h3>
            {notices && notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id}
                    onClick={() => navigate(`/notices/${notice.id}`)}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm cursor-pointer transition-all">
                    <p className="text-xs font-bold text-indigo-500 mb-1">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                    <h4 className="font-bold text-slate-800 truncate">{notice.title}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-medium">
                새로운 공지사항이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 내 강의 목록 영역 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-indigo-600 h-6 w-6" />내 강의 상세 정보
            </h3>
          </div>

          {stats.classes && stats.classes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full">
                        {cls.courseTitle}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {cls.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-100">
                      <span>수강생 현황</span>
                      <span className="font-bold text-slate-700">
                        <span className="text-indigo-600 text-base">
                          {cls.enrolledCount}
                        </span>{" "}
                        / {cls.capacity} 명
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 pt-2">
                      <span className="text-xs text-slate-400">일정</span>
                      <span className="text-slate-600 font-semibold">
                        {new Date(cls.startDate).toLocaleDateString()} ~{" "}
                        {new Date(cls.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Users className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                현재 담당 중인 강의가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
