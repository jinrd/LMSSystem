/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from "react";

export default function AdminEnrollmentModal({ classData, onClose, onUpdate }) {
  const [enrollments, setEnrollments] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEnrollments();
    fetchAllStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. 현재 이 강좌를 수강 중인 학생 목록 불러오기
  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(
        `http://localhost:5001/api/classes/${classData.id}/enrollments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (error) {
      console.error("수강생 목록 조회 실패", error);
    }
  };

  // 2. 수강생으로 등록할 수 있는 전체 학생(STUDENT) 목록 불러오기
  const fetchAllStudents = async () => {
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("http://localhost:5001/api/users?role=STUDENT", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllStudents(data);
      }
    } catch (error) {
      console.error("전체 학생 목록 조회 실패", error);
    }
  };

  // 3. 학생 등록하기
  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return alert("학생을 선택해주세요.");

    setIsLoading(true);
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(
        `http://localhost:5001/api/classes/${classData.id}/enrollments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId: selectedStudentId }),
        },
      );

      if (res.ok) {
        alert("수강생이 등록되었습니다.");
        setSelectedStudentId(""); // 선택창 초기화
        fetchEnrollments(); // 목록 갱신
        if (onUpdate) onUpdate(); // 부모 컴포넌트 갱신 (수강 인원 카운트 업데이트용)
      } else {
        const errorData = await res.json();
        alert(errorData.message || "등록 실패");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 학생 삭제하기
  const handleRemove = async (studentId, studentName) => {
    if (!window.confirm(`'${studentName}' 학생의 수강을 취소하시겠습니까?`))
      return;

    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(
        `http://localhost:5001/api/classes/${classData.id}/enrollments/${studentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        alert("수강이 취소되었습니다.");
        fetchEnrollments();
        if (onUpdate) onUpdate(); // 부모 갱신
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 이미 등록된 학생인지 확인하여 필터링
  const enrolledStudentIds = enrollments.map((e) => e.studentId);
  const availableStudents = allStudents.filter(
    (s) => !enrolledStudentIds.includes(s.id),
  );

  // 이름이나 이메일로 검색 필터링
  const filteredStudents = availableStudents.filter(
    (s) => s.name.includes(searchQuery) || s.email.includes(searchQuery),
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-indigo-900">
            [{classData.name}] 수강생 관리
          </h2>
          <button
            onClick={onClose}
            className="text-indigo-500 hover:text-indigo-800 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. 수강생 등록 폼 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">
              신규 수강생 등록
            </h3>
            <form onSubmit={handleEnroll} className="flex gap-2 items-start">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="등록할 학생의 이름 또는 이메일을 검색하세요..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedStudentId(""); // 검색어 변경 시 선택 초기화
                  }}
                  className="w-full border p-2 rounded bg-white"
                  required
                />
                {/* 검색 결과 드롭다운 */}
                {searchQuery && !selectedStudentId && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg max-h-40 overflow-y-auto mt-1">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <li
                          key={student.id}
                          onClick={() => {
                            setSelectedStudentId(student.id);
                            setSearchQuery(
                              `${student.name} (${student.email})`,
                            );
                          }}
                          className="p-2 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-b-0"
                        >
                          {student.name}{" "}
                          <span className="text-gray-500">
                            ({student.email})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-sm text-gray-500 text-center">
                        검색 결과가 없습니다.
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !selectedStudentId}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? "등록 중..." : "등록 추가"}
              </button>
            </form>
            {availableStudents.length === 0 && allStudents.length > 0 && (
              <p className="text-xs text-red-500 mt-2">
                모든 학생이 이미 등록되어 있습니다.
              </p>
            )}
          </div>

          {/* 2. 현재 수강생 목록 테이블 */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-bold text-lg">등록된 수강생 목록</h3>
              <span className="text-sm font-bold text-gray-600">
                현재 인원: {enrollments.length} / {classData.capacity} 명
              </span>
            </div>

            {enrollments.length > 0 ? (
              <div className="border rounded overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border-b">이름</th>
                      <th className="p-3 border-b">이메일</th>
                      <th className="p-3 border-b text-center">등록일</th>
                      <th className="p-3 border-b text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr
                        key={enrollment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">
                          {enrollment.student.name}
                        </td>
                        <td className="p-3 text-gray-600">
                          {enrollment.student.email}
                        </td>
                        <td className="p-3 text-center text-gray-500">
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              handleRemove(
                                enrollment.studentId,
                                enrollment.student.name,
                              )
                            }
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                          >
                            수강 취소
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 border rounded text-gray-500">
                현재 이 강좌를 듣고 있는 수강생이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
