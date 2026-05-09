/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Edit, Trash2 } from "lucide-react";

export default function NoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    const fetchNotice = async () => {
      const token = localStorage.getItem("lms_token");
      try {
        const res = await fetch(`http://localhost:5001/api/notices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setNotice(data);
        } else {
          alert("공지사항을 불러오는데 실패했습니다.");
          navigate("/notices");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotice();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const token = localStorage.getItem("lms_token");

    try {
      const res = await fetch(`http://localhost:5001/api/notices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("공지사항이 삭제되었습니다.");
        navigate("/notices");
      } else {
        alert("공지사항 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!notice) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[calc(100vh-4rem)]">
      <div className="mb-6 flex items-center justify-between">
        <button
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
          onClick={() => navigate("/notices")}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          목록으로
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">{notice.title}</h1>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {notice.author && (
              <div className="flex items-center">
                <span className="w-1 h-1 rounded-full bg-gray-300 mr-3"></span>
                <span>{notice.author.name || "관리자"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="min-h-[300px] whitespace-pre-wrap text-gray-700 leading-relaxed text-lg font-light">
            {notice.content}
          </div>
        </div>

        {/* Footer / Actions Section */}
        {userRole === "ADMIN" && (
          <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button
              onClick={() => navigate(`/notices/edit/${id}`)}
              className="flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all shadow-sm font-medium"
            >
              <Edit className="w-4 h-4 mr-2" />
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all shadow-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
