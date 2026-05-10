/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
// client/src/pages/admin/AdminCourseManagement.jsx
import React, { useState, useEffect } from "react";
import AdminClassModal from "../../components/AdminClassModal";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 모달 제어용 상태
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("http://localhost:5001/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);

        // ✨ [추가된 부분] 새로고침 후, 모달이 열려있다면 모달 안의 데이터도 최신으로 교체!
        setSelectedCourse((prev) =>
          prev ? data.find((c) => c.id === prev.id) || prev : null,
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: "", title: "", description: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert("과목명을 입력해주세요.");

    try {
      setIsLoading(true);
      const token = localStorage.getItem("lms_token");
      const url = isEditing
        ? `http://localhost:5001/api/courses/${formData.id}`
        : "http://localhost:5001/api/courses";
      const method = isEditing ? "PUT" : "POST";

      console.log("수정 url : {}", url);

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      if (res.ok) {
        alert(isEditing ? "과목이 수정되었습니다." : "과목이 등록되었습니다.");
        fetchCourses(); // 갱신된 데이터 다시 불러오기
        resetForm();
      } else {
        alert("처리에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "정말 삭제하시겠습니까? 관련된 강좌도 모두 삭제될 수 있습니다.",
      )
    )
      return;
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("삭제되었습니다.");
        fetchCourses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openClassManager = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        교육과정(과목) 관리
      </h1>

      {/* 과목 입력 폼 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "과목 수정" : "신규 과목 등록"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              과목명 (예: 네일아트 마스터)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 (선택사항)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {isEditing ? "수정 완료" : "과목 등록"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 rounded-lg"
              >
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 과목 리스트 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                과목명
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                개설 강좌 수
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {course.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {course.description || "-"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {course.classes ? course.classes.length : 0}개 운영중
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  {/* 핵심: 강좌 관리 모달 열기 버튼 */}
                  <button
                    onClick={() => openClassManager(course)}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    강좌 관리
                  </button>
                  <button
                    onClick={() => {
                      setFormData(course);
                      setIsEditing(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
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
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 렌더링 */}
      {isModalOpen && (
        <AdminClassModal
          course={selectedCourse}
          onClose={() => {
            setIsModalOpen(false);
            fetchCourses();
          }}
          onUpdate={fetchCourses}
        />
      )}
    </div>
  );
}
