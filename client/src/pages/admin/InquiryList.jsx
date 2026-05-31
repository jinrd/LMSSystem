import React, { useState, useEffect } from "react";
import { inquiryAPI } from "../../api";

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answer, setAnswer] = useState("");

  const fetchInquiries = async () => {
    try {
      const data = await inquiryAPI.getInquiries();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      alert("문의 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return alert("답변 내용을 입력해주세요.");

    try {
      const data = await inquiryAPI.answerInquiry(selectedInquiry.id, { answer });
      if (data.success) {
        alert("답변이 등록되었습니다.");
        setSelectedInquiry(null);
        setAnswer("");
        fetchInquiries();
      }
    } catch (error) {
      alert("답변 등록에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">1:1 문의 관리</h1>
        <p className="text-slate-500 mt-1">학생들의 문의 사항을 확인하고 답변을 작성합니다.</p>
      </div>

      {/* 모바일 뷰 (카드형) */}
      <div className="md:hidden flex flex-col gap-4">
        {inquiries.length === 0 ? (
          <div className="text-center text-slate-500 py-8 bg-white rounded-2xl border border-slate-100">등록된 문의가 없습니다.</div>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-start mb-1">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${inq.status === "ANSWERED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {inq.status === "ANSWERED" ? "답변완료" : "답변대기"}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-bold text-slate-800 text-base leading-snug break-words">
                {inq.title}
              </h3>
              
              <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">{inq.student?.name}</span>
                  <span className="text-xs text-slate-400">{inq.student?.email}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedInquiry(inq);
                    setAnswer(inq.answer || "");
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-xl text-sm font-bold transition-colors"
                >
                  상세/답변
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PC 뷰 (테이블형) */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold w-24">상태</th>
              <th className="px-6 py-4 font-semibold">제목</th>
              <th className="px-6 py-4 font-semibold w-32">학생명</th>
              <th className="px-6 py-4 font-semibold w-40">등록일</th>
              <th className="px-6 py-4 font-semibold w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                  등록된 문의가 없습니다.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${inq.status === "ANSWERED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {inq.status === "ANSWERED" ? "답변완료" : "답변대기"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 truncate max-w-md">
                    {inq.title}
                  </td>
                  <td className="px-6 py-4">
                    {inq.student?.name}
                    <div className="text-xs text-slate-400 mt-0.5">{inq.student?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setAnswer(inq.answer || "");
                      }}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      상세/답변
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">문의 상세 내역</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                닫기
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-slate-800">{selectedInquiry.title}</span>
                  <span className="text-sm text-slate-500">
                    {selectedInquiry.student?.name} · {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap text-sm">
                  {selectedInquiry.content}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-indigo-900 mb-3">
                  {selectedInquiry.status === "ANSWERED" ? "등록된 답변" : "답변 작성하기"}
                </h3>
                <form onSubmit={handleAnswerSubmit}>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-indigo-100 bg-indigo-50/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none text-sm"
                    placeholder="답변 내용을 작성해주세요."
                    required
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm text-sm"
                    >
                      {selectedInquiry.status === "ANSWERED" ? "답변 수정하기" : "답변 등록하기"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
