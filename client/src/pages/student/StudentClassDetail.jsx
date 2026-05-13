import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Calendar, CheckCircle, Mail } from "lucide-react";

export default function StudentClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [myEnrollment, setMyEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const token = localStorage.getItem("lms_token");
                const res = await fetch(`http://localhost:5001/api/classes/student/${id}/detail`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setClassData(data.classInfo);
                    setMyEnrollment(data.myEnrollment);
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
                        <p className="text-sm font-semibold text-slate-500 mb-1">담당 선생님</p>
                        <p className="text-2xl font-bold text-slate-800 flex items-center gap-2 justify-end">
                            <Users className="w-5 h-5 text-indigo-500" />
                            {classData.instructorName}
                        </p>
                    </div>
                </div>

                {/* 나의 수강 정보 & 연락처 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            나의 수강 정보
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="text-slate-500 font-medium text-sm">수강 등록일</span>
                                <span className="text-slate-800 font-bold">{new Date(myEnrollment?.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                <span className="text-slate-500 font-medium text-sm">현재 상태</span>
                                <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">
                                    {myEnrollment?.status === "ENROLLED" ? "수강 중" : myEnrollment?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <Mail className="w-5 h-5 text-indigo-500" />
                            담당 선생님 연락처
                        </h2>
                        <div className="p-6 border border-slate-100 rounded-2xl bg-indigo-50/30 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-100">
                                <Users className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{classData.instructorName} 선생님</h3>
                            <p className="text-indigo-600 font-medium mt-2">{classData.instructorEmail}</p>
                            <button className="mt-6 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm">
                                선생님께 메일 보내기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
