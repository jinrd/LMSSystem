/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { noticeAPI } from "../../api"; // API 함수 import

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    
    const fetchNotices = async () => {
      try {
        const data = await noticeAPI.getNotices(page, limit);
        setNotices(data.notices);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("공지사항을 불러오는 중 오류 발생:", error.message);
      }
    };
    
    fetchNotices();
  }, [page, limit]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">공지사항</h1>
        <div className="flex gap-4">
          {/* 글쓰기 버튼 : 원장(ADMIN) 만 노출 */}
          {userRole === "ADMIN" && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate("/notices/create")}
            >
              글쓰기
            </button>
          )}
          {/* 페이징 드롭다운 */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // 표시개수 변경시 1페이지로 리셋
            }}
            className="border p-2 rounded"
          >
            <option value={20}>20개씩 보기</option>
            <option value={30}>30개씩 보기</option>
            <option value={40}>40개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>
        </div>
      </div>
      {/* 테이블 영역 */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3 border-b">번호</th>
            <th className="p-3 border-b">제목</th>
            <th className="p-3 border-b">작성일</th>
          </tr>
        </thead>
        <tbody>
          {notices && notices.length > 0 ? (
            notices.map((notice) => (
              <tr
                key={notice.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/notices/${notice.id}`)}
              >
                <td className="p-3">{notice.id}</td>
                <td className="p-3">{notice.title}</td>
                <td className="p-3">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-5 text-center text-gray-500">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 영역 */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-1 font-bold">
          {page} / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
