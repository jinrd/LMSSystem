import React, { useState, useEffect } from "react";
import { inquiryAPI } from "../../api";

export default function Inquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const data = await inquiryAPI.getInquiries();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error(error);
      alert("문의 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요.");

    try {
      const data = await inquiryAPI.createInquiry({ title, content });
      if (data.success) {
        alert("문의가 등록되었습니다.");
        setTitle("");
        setContent("");
        setIsModalOpen(false);
        fetchInquiries();
      }
    } catch (error) {
      alert("문의 등록에 실패했습니다.");
    }
  };

  if (loading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">1:1 문의</h1>
          <p className="text-slate-500 mt-1">궁금한 점을 문의하시면 선생님이 답변해 드립니다.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          문의 작성하기
        </button>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
            등록된 문의 내역이 없습니다.
          </div>
        ) : (
          inquiries.map((inq) => (
            <div key={inq.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{inq.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(inq.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${inq.status === "ANSWERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {inq.status === "ANSWERED" ? "답변완료" : "답변대기"}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap mb-4 text-sm">
                {inq.content}
              </div>

              {inq.status === "ANSWERED" && inq.answer && (
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-indigo-600">답변</span>
                    <span className="text-sm text-slate-500">
                      {inq.answeredBy?.name || "선생님"} ({new Date(inq.answeredAt).toLocaleString()})
                    </span>
                  </div>
                  <div className="bg-indigo-50/50 p-4 rounded-xl text-slate-800 whitespace-pre-wrap text-sm border border-indigo-100/50">
                    {inq.answer}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">새 문의 작성</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                  placeholder="문의 제목을 입력하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="문의 내용을 상세히 작성해주세요"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
