import { useState, useEffect } from "react";
import { Users, UserCheck, BookOpen, Clock, Bell, UserPlus } from "lucide-react";
import { dashboardAPI } from "../../api";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await dashboardAPI.getAdminSummary();
        setSummary(res.data);
      } catch (err) {
        setError(err.message || "통계 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center font-bold">{error}</div>;
  }

  const { stats, recentStudents, recentNotices } = summary;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">관리자 통합 모니터링</h1>
          <p className="text-slate-500 mt-2 font-medium">학원의 전체 운영 현황을 한눈에 파악하세요.</p>
        </div>
        <div className="text-sm font-medium text-slate-400 flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
          <Clock className="w-4 h-4 mr-2" />
          마지막 업데이트: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/30 transform transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium mb-1">총 활성 수강생</p>
              <h3 className="text-4xl font-bold">{stats.totalStudents}명</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-400 to-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/30 transform transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 font-medium mb-1">등록된 강사</p>
              <h3 className="text-4xl font-bold">{stats.totalTeachers}명</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-500/30 transform transition-transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 font-medium mb-1">운영 중인 강좌</p>
              <h3 className="text-4xl font-bold">{stats.activeClasses}개</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 가입 학생 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-blue-500" /> 최근 가입한 학생
            </h2>
            <Link to="/admin/users" className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
              전체보기
            </Link>
          </div>
          <div className="space-y-4">
            {recentStudents.length === 0 ? (
              <p className="text-slate-500 text-center py-4">최근 가입한 학생이 없습니다.</p>
            ) : (
              recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-4">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 font-medium">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 최근 공지사항 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-amber-500" /> 최근 공지사항
            </h2>
            <Link to="/notices" className="text-sm font-medium text-amber-600 hover:text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full transition-colors">
              전체보기
            </Link>
          </div>
          <div className="space-y-4">
            {recentNotices.length === 0 ? (
              <p className="text-slate-500 text-center py-4">최근 등록된 공지사항이 없습니다.</p>
            ) : (
              recentNotices.map((notice) => (
                <Link to={`/notices/${notice.id}`} key={notice.id} className="block p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <p className="font-bold text-slate-800 mb-1 truncate">{notice.title}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 line-clamp-1">{notice.content}</span>
                    <span className="text-slate-400 font-medium whitespace-nowrap ml-4">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
