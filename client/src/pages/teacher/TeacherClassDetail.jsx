import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Calendar, CheckCircle } from "lucide-react";

export default function TeacherClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const token = localStorage.getItem("lms_token");
                const res = await fetch(`http://localhost:5001/api/classes/teacher/${id}/detail`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setClassData(data.classInfo);
                    setEnrollments(data.enrollments || []);
                } else {
                    alert("정보를 불러올 수 없거나 접근 권한이 없습니다.");
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("강의 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [id, navigate]);

    if (loading) return <div className="p-10 text-center text-slate-500 font-bold">로딩 중...</div>;
    if (!classData) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-8 animate-fade-in-up">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 mb-8 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    대시보드로 돌아가기
                </button>

                {/* 강의 정보 헤더 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full">
                                {classData.courseTitle || "강의"}
                            </span>
                            <span className="px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full">
                                담당 클래스
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            {classData.name}
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(classData.startDate).toLocaleDateString()} ~ {new Date(classData.endDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-500 mb-1">현재 수강 인원</p>
                        <p className="text-3xl font-black text-slate-800">
                            {enrollments.length}<span className="text-lg text-slate-400 ml-1">명</span>
                        </p>
                    </div>
                </div>

                {/* 학생 명단 테이블 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-500" />
                            전체 수강생 명단
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                                    <th className="px-6 py-4 font-semibold">이름</th>
                                    <th className="px-6 py-4 font-semibold">이메일</th>
                                    <th className="px-6 py-4 font-semibold">등록일</th>
                                    <th className="px-6 py-4 font-semibold text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {enrollments.length > 0 ? (
                                    enrollments.map((enrollment) => (
                                        <tr key={enrollment.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{enrollment.student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                {enrollment.student.email}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                {new Date(enrollment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors">
                                                    <CheckCircle className="w-3 h-3" /> 출석체크
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium">
                                            아직 등록된 수강생이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
