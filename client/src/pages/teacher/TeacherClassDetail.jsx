import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, ArrowLeft, Calendar, CheckCircle, FileText, Plus, ChevronDown, ChevronUp, Download } from "lucide-react";
import { assignmentAPI } from "../../api";

export default function TeacherClassDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [classData, setClassData] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [assignments, setAssignments] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "" });
    const [expandedAssignment, setExpandedAssignment] = useState(null);
    const [submissionsMap, setSubmissionsMap] = useState({});
    const [gradingData, setGradingData] = useState({ score: "", feedback: "" });

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAssignments();
    }, [id, navigate, fetchAssignments]);

    const handleCreateAssignment = async () => {
        if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        try {
            await assignmentAPI.createAssignment(id, newAssignment);
            alert("과제가 출제되었습니다.");
            setShowCreateModal(false);
            setNewAssignment({ title: "", description: "", dueDate: "" });
            fetchAssignments();
        } catch {
            alert("과제 출제 실패");
        }
    };

    const toggleAssignmentExpand = async (assignmentId) => {
        if (expandedAssignment === assignmentId) {
            setExpandedAssignment(null);
            return;
        }

        setExpandedAssignment(assignmentId);
        if (!submissionsMap[assignmentId]) {
            try {
                const subs = await assignmentAPI.getSubmissions(assignmentId);
                setSubmissionsMap(prev => ({ ...prev, [assignmentId]: subs }));
            } catch (error) {
                console.error("제출물 불러오기 실패", error);
            }
        }
    };

    const handleGrade = async (submissionId, assignmentId) => {
        try {
            await assignmentAPI.gradeSubmission(submissionId, gradingData);
            alert("채점이 완료되었습니다.");
            setGradingData({ score: "", feedback: "" });
            // 리로드
            const subs = await assignmentAPI.getSubmissions(assignmentId);
            setSubmissionsMap(prev => ({ ...prev, [assignmentId]: subs }));
        } catch {
            alert("채점 실패");
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
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
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

                {/* 과제 관리 섹션 */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            과제 관리
                        </h2>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" /> 새 과제 출제
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {assignments.length > 0 ? (
                            assignments.map(assignment => (
                                <div key={assignment.id} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                                    {/* 과제 헤더 (클릭 시 아코디언 열림) */}
                                    <div
                                        onClick={() => toggleAssignmentExpand(assignment.id)}
                                        className="bg-slate-50 p-5 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
                                    >
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-1">{assignment.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium">마감일: <span className="text-rose-500">{new Date(assignment.dueDate).toLocaleDateString()}</span></p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                                제출 {submissionsMap[assignment.id]?.length || 0}명
                                            </span>
                                            {expandedAssignment === assignment.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                        </div>
                                    </div>

                                    {/* 과제 상세 및 제출물 목록 (아코디언 내용) */}
                                    {expandedAssignment === assignment.id && (
                                        <div className="p-5 border-t border-slate-200 bg-white">
                                            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{assignment.description}</p>
                                            </div>

                                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                <Users className="w-4 h-4 text-slate-500" /> 제출 현황 및 채점
                                            </h4>

                                            <div className="space-y-4">
                                                {(submissionsMap[assignment.id] || []).length > 0 ? (
                                                    submissionsMap[assignment.id].map(sub => (
                                                        <div key={sub.id} className="border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                                            <div className="flex-1">
                                                                <p className="font-bold text-slate-800">{sub.student.name} <span className="text-xs font-normal text-slate-500 ml-2">{new Date(sub.createdAt).toLocaleString()} 제출</span></p>
                                                                <p className="text-sm text-slate-600 mt-2 p-3 bg-slate-50 rounded-lg">{sub.content || "(텍스트 내용 없음)"}</p>
                                                                {sub.fileUrl && (
                                                                    <a href={`http://localhost:5001/${sub.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                                                        <Download className="w-3 h-3" /> 첨부파일 확인
                                                                    </a>
                                                                )}
                                                            </div>

                                                            {/* 채점 UI */}
                                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full md:w-80">
                                                                {sub.status === "GRADED" ? (
                                                                    <div>
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">채점 완료</span>
                                                                            <span className="font-black text-slate-800">{sub.score}점</span>
                                                                        </div>
                                                                        <p className="text-sm text-slate-600 italic">"{sub.feedback}"</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-col gap-2">
                                                                        <div className="flex gap-2">
                                                                            <input
                                                                                type="number"
                                                                                placeholder="점수"
                                                                                className="w-20 border border-slate-200 rounded-lg p-2 text-sm text-center"
                                                                                onChange={e => setGradingData(prev => ({ ...prev, score: e.target.value }))}
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                placeholder="피드백 입력..."
                                                                                className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
                                                                                onChange={e => setGradingData(prev => ({ ...prev, feedback: e.target.value }))}
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleGrade(sub.id, assignment.id)}
                                                                            className="w-full bg-slate-800 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-700 transition-colors"
                                                                        >
                                                                            채점 저장
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500 text-center py-4">아직 제출한 학생이 없습니다.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500 text-sm">출제된 과제가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* 과제 출제 모달 */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
                        <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-xl border border-slate-100">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2 mb-6">
                                <Plus className="w-5 h-5 text-indigo-500" />
                                새 과제 출제
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">과제 제목</label>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={newAssignment.title}
                                        onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">과제 설명</label>
                                    <textarea
                                        className="w-full border border-slate-200 p-3 rounded-xl h-32 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                        value={newAssignment.description}
                                        onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-600 mb-1">마감일</label>
                                    <input
                                        type="date"
                                        className="w-full border border-slate-200 p-3 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={newAssignment.dueDate}
                                        onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleCreateAssignment}
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                                >
                                    출제하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
