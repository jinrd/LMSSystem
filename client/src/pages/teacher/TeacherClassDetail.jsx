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
                const res = await fetch(`http://localhost:5001/api/classes/teacher/${id}/enrollments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });


                if (res.ok) {
                    const data = await res.json();

                    console.log("data : " + data.classInfo)
                    console.log("data : " + data.enrollments)

                    setClassData(data.classInfo);
                    setEnrollments(data.enrollments);
                } else {
                    alert("명단을 불러올 수 없거나 접근 권한이 없습니다.");
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("수강생 정보를 불러오지 못했습니다.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClassDetails();
    }, [id, navigate]);

    if (loading) return <div className="p-10 text-center text-slate-500">로딩 중...</div>;
    if (!classData) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-8 animate-fade-in-up">
            <div className="max-w-6xl mx-auto">
                {/* 뒤로 가기 및 헤더 */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100 text-slate-600 transition-all hover:-translate-x-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full">
                                {classData.course.title}
                            </span>
                            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                                {classData.name} 수강생 명단
                            </h1>
                        </div>
                    </div>
                </div>

                {/* 강의 요약 정보 카드 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-8 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <Users className="text-indigo-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">현재 수강 인원</p>
                            <p className="text-xl font-bold text-slate-800">{enrollments.length} <span className="text-sm font-medium text-slate-500">/ {classData.capacity}명</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 rounded-2xl">
                            <Calendar className="text-emerald-600 w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">강의 기간</p>
                            <p className="text-sm font-bold text-slate-800">
                                {new Date(classData.startDate).toLocaleDateString()} ~ {new Date(classData.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 학생 목록 테이블 영역 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">이름</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">이메일</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">등록일</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">출석 체크 (예시)</th>
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
                                                    <CheckCircle className="w-3 h-3" /> 출석
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
