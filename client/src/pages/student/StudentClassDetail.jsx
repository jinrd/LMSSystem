import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Calendar, CheckCircle, Mail, Upload, FileText } from "lucide-react";
import { assignmentAPI } from "../../api";

export default function StudentClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [myEnrollment, setMyEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [assignments, setAssignments] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [submitContent, setSubmitContent] = useState("");
    const fileInputRef = useRef(null);

    const fetchAssignments = useCallback(async () => {
        try {
            const data = await assignmentAPI.getAssignments(id);
            setAssignments(data);
        } catch (error) {
            console.error("과제 불러오기 실패", error);
        }
    }, [id]);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAssignments();
    }, [id, navigate, fetchAssignments]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("content", submitContent);
            if (fileInputRef.current.files[0]) {
                formData.append("file", fileInputRef.current.files[0]);
            }

            await assignmentAPI.submitAssignment(selectedAssignmentId, formData);
            alert("과제가 제출되었습니다.");
            setShowSubmitModal(false);
            fetchAssignments();
        } catch (error) {
            alert("제출 실패: " + (error.response?.data?.message || error.message));
        }
    };

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                {/* 나의 과제 목록 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                        <Upload className="w-5 h-5 text-emerald-500" />
                        나의 과제 목록
                    </h2>
                    <div className="space-y-4">
                        {assignments.length > 0 ? (
                            assignments.map(assignment => (
                                <div key={assignment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-xl bg-slate-50 gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                           <FileText className="w-4 h-4 text-slate-400" />
                                           <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{assignment.description}</p>
                                        <p className="text-xs font-semibold text-rose-500">마감일: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {assignment.submissions && assignment.submissions.length > 0 ? (
                                            assignment.submissions[0].status === "GRADED" ? (
                                                <div className="text-right">
                                                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-1">채점 완료: {assignment.submissions[0].score}점</div>
                                                    {assignment.submissions[0].feedback && <p className="text-xs text-slate-500 italic max-w-xs mt-1">"{assignment.submissions[0].feedback}"</p>}
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">제출 완료 (채점 대기)</span>
                                            )
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    setSelectedAssignmentId(assignment.id);
                                                    setShowSubmitModal(true);
                                                    setSubmitContent(""); // 모달 열때 초기화
                                                }}
                                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all whitespace-nowrap"
                                            >
                                                제출하기
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center py-8 text-slate-500 text-sm">현재 등록된 과제가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 과제 제출 모달 */}
                {showSubmitModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-emerald-500" />
                                    과제 제출
                                </h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">텍스트 내용 (선택)</label>
                                    <textarea 
                                        placeholder="과제 내용이나 선생님께 남길 메시지를 입력하세요" 
                                        className="w-full border border-slate-200 p-3 rounded-xl h-32 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                                        value={submitContent}
                                        onChange={e => setSubmitContent(e.target.value)} 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-2">첨부 파일 (선택)</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" 
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 ml-1">이미지(jpg, png) 또는 PDF 파일만 업로드 가능합니다.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button 
                                    onClick={() => setShowSubmitModal(false)} 
                                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-200 transition-all"
                                >
                                    제출 완료하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
