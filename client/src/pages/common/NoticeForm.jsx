/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, X } from "lucide-react";
import { noticeAPI } from "../../api";

export default function NoticeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const data = await noticeAPI.getNoticeById(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        alert("데이터를 불러오지 못했습니다.");
        navigate("/notices");
      }
    };

    if (isEditMode) {
      fetchNoticeData();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return alert("제목과 내용을 모두 입력해주세요.");
    }

    setIsLoading(true);

    try {
      if (isEditMode) {
        await noticeAPI.updateNotice(id, { title, content });
        navigate(`/notices/${id}`);
      } else {
        await noticeAPI.createNotice({ title, content });
        navigate("/notices");
      }
    } catch (error) {
      alert("저장에 실패했습니다: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          onClick={() => navigate(isEditMode ? `/notices/${id}` : "/notices")}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          뒤로가기
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEditMode ? "공지사항 수정" : "새 공지사항 작성"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            학생들과 강사들에게 전달할 중요한 내용을 작성해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all h-[400px] resize-none text-gray-800 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공지사항 내용을 상세히 작성해주세요"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() =>
                navigate(isEditMode ? `/notices/${id}` : "/notices")
              }
              className="flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all shadow-sm font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
