/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 수강 입력 폼 상태
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    instructor: "",
    capacity: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // 컴포넌트 마운트 시 강의 목록 조회
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("강의 데이터를 불러오지 못했습니다.");
        const data = await response.json(); // 수정: json()으로 파싱
        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: "", title: "", instructor: "", capacity: "" });
    setIsEditing(false);
  };

  const handleEditClick = (course) => {
    setFormData({ ...course });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.instructor || !formData.capacity) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("lms_token");

      // 공통 헤더 설정 (Content-Type 필수 추가)
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      console.log("headers : {}", headers);
      if (isEditing) {
        // PUT: 특정 ID를 URL에 포함하는 것이 일반적인 RESTful 방식입니다.
        const response = await fetch(
          `http://localhost:5001/api/courses/${formData.id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(formData),
          },
        );

        const data = await response.json(); // 응답 데이터 파싱

        if (response.ok) {
          const updatedCourse = data.course;
          setCourses(
            courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)),
          );
          alert("수정되었습니다.");
          resetForm();
        } else {
          alert(data.message || "수정에 실패했습니다.");
        }
      } else {
        // POST: 신규 등록

        console.log("formData : {}", formData);
        const response = await fetch("http://localhost:5001/api/courses", {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: formData.title,
            instructor: formData.instructor,
            capacity: formData.capacity,
          }),
        });

        const data = await response.json(); // 응답 데이터 파싱

        if (response.ok) {
          const newCourse = data.course;
          // 수정: 기존 map 대신 배열 맨 앞에 새 데이터를 추가
          setCourses([newCourse, ...courses]);
          alert("등록되었습니다.");
          resetForm();
        } else {
          alert(data.message || "등록에 실패했습니다.");
        }
      }
    } catch (error) {
      setError(error.message);
      // 수정: 올바른 JavaScript 템플릿 리터럴 문법 사용
      alert(`작업 처리 중 오류가 발생했습니다 : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 이 강의를 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");

      // DELETE: URL에 삭제할 ID 포함
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // 성공 시 목록에서 해당 ID 제거
        setCourses(courses.filter((c) => c.id !== id));
        alert("삭제되었습니다.");
      } else {
        const data = await response.json();
        alert(data.message || "삭제에 실패했습니다.");
      }
    } catch (error) {
      setError(error.message);
      alert(`작업 처리 중 오류가 발생했습니다 : ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        강의 관리 시스템 (ADMIN)
      </h1>

      {/* 입력 폼 섹션 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditing ? "강의 수정" : "신규 강의 등록"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          {/* 하위 UI 코드는 기존 작성하신 내용과 100% 동일하게 유지했습니다. */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강의명
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="강의명을 입력하세요"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강사명
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="강사명"
            />
          </div>
          <div className="flex-1 min-w-[100px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수용 인원
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0 명"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "처리 중..." : isEditing ? "수정 완료" : "강의 등록"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 강의 목록 테이블 섹션 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강의명
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                강사명
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                수용 인원
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  등록된 강의가 없습니다.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {course.capacity} 명
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
