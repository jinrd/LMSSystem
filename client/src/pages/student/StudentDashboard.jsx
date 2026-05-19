import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Bell, User } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [studentInfo] = useState(() => {
    const name = localStorage.getItem("userName") || "수강생";
    return { name };
  });

  const [userStatus, setUserStatus] = useState("ACTIVE");

  const [stats, setStats] = useState({
    totalClasses: 0,
    todaySchedules: 0,
    todaySchedulesList: [],
    classes: [],
  });

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // 0. 내 상태(휴학 여부) 먼저 확인하기
    const fetchMyStatus = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const res = await fetch("http://localhost:5001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserStatus(data.status || "ACTIVE");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyStatus();

    // 1. 학원 최근 공지사항 불러오기
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
    };

    // 2. 내 수강 현황 불러오기
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        const res = await fetch("http://localhost:5001/api/classes/student/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("수강생 대시보드 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchStatus();
    fetchNotices();
  }, []);

  // 휴학 중일 경우 대시보드 화면 자체를 덮어버림
  if (userStatus === "ON_LEAVE") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 animate-fade-in-up">
         <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 text-center max-w-md w-full">
           <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <User className="w-10 h-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">현재 휴학 상태입니다</h2>
           <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              수강 내역 조회 및 시간표 접근이 일시적으로 제한되었습니다.<br />
              다시 수업에 참여하시려면 학원 데스크로 문의해 주세요.
           </p>
           <button onClick={() => {
              localStorage.removeItem("lms_token");
              localStorage.removeItem("role");
              localStorage.removeItem("userName");
              navigate("/");
           }} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors">
              안전하게 로그아웃
           </button>
         </div>
      </div>
    );
  }

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
        </header>

        {/* 상단 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:from-blue-500 group-hover:to-blue-600 transition-colors duration-300">
              <BookOpen className="text-blue-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">수강 중인 강의</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{stats.totalClasses}<span className="text-lg font-bold text-slate-400 ml-1">개</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 flex items-center space-x-5 transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl group-hover:from-indigo-500 group-hover:to-indigo-600 transition-colors duration-300">
              <Clock className="text-indigo-600 h-7 w-7 group-hover:text-white transition-colors duration-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">오늘 예정된 수업</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1">{stats.todaySchedules}<span className="text-lg font-bold text-slate-400 ml-1">개</span></p>
            </div>
          </div>
        </div>

        {/* 중간 영역: 오늘의 스케줄 & 공지사항 위젯 */}
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
                      <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> {schedule.instructorName} 선생님
                      </p>
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

        {/* 하단: 수강 중인 강의 목록 영역 */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-600 h-6 w-6" />수강 중인 강의
            </h3>
          </div>

          {stats.classes && stats.classes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.classes.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/student/classes/${cls.id}`)}
                  className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-full">
                        {cls.courseTitle}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {cls.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-100">
                      <span>담당 선생님</span>
                      <span className="font-bold text-slate-700">
                        {cls.instructorName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 pt-2">
                      <span className="text-xs text-slate-400">수강 기간</span>
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
                <BookOpen className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                아직 수강 중인 강의가 없습니다.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
