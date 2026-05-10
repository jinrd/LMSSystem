/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
// client/src/components/AdminClassModal.jsx
import React, { useState, useEffect } from "react";
import AdminEnrollmentModal from "./AdminEnrollmentModal";

export default function AdminClassModal({ course, onClose, onUpdate }) {
  const [teachers, setTeachers] = useState([]);
  const [enrollmentClass, setEnrollmentClass] = useState(false);
  // 강좌(Class) 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    capacity: 20,
    startDate: "",
    endDate: "",
    instructorId: "",
  });

  // 스케줄 배열 상태 (초기값 1개)
  const [schedules, setSchedules] = useState([
    { dayOfWeek: 1, startTime: "", endTime: "" }, // 초기값 비워두기
  ]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("lms_token");
      // 방금 추가한 API를 활용하여 TEACHER 역할을 가진 유저만 불러옵니다.
      const res = await fetch("http://localhost:5001/api/users?role=TEACHER", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error("강사 목록 조회 실패", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const addScheduleRow = () => {
    setSchedules([...schedules, { dayOfWeek: 1, startTime: "", endTime: "" }]);
  };

  const removeScheduleRow = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.instructorId) return alert("강사를 선택해주세요.");
    if (schedules.length === 0) return alert("스케줄을 1개 이상 추가해주세요.");

    try {
      const token = localStorage.getItem("lms_token");
      const payload = {
        ...formData,
        courseId: course.id,
        schedules: schedules,
      };

      const res = await fetch("http://localhost:5001/api/classes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("강좌가 개설되었습니다!");
        onUpdate();
        setFormData({ ...formData, name: "", startDate: "", endDate: "" });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "개설 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeClassRow = async (c) => {
    if (!window.confirm(`'${c.name}' 강좌를 삭제하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`http://localhost:5001/api/classes/${c.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("강좌가 삭제되었습니다.");
        onUpdate();
      } else {
        alert("강좌 삭제 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">[{course.title}] 강좌 관리</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 모달 내용 영역 (스크롤 가능) */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 강좌 생성 폼 */}
          <div className="bg-gray-50 p-5 rounded-lg border mb-8">
            <h3 className="font-bold text-lg mb-4 text-indigo-700">
              새로운 강좌 개설하기
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    강좌 이름 (예: 5월 주말반)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    정원 (명)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    개강일
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    종강일
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  담당 강사 선택
                </label>
                <select
                  name="instructorId"
                  value={formData.instructorId}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded bg-white"
                  required
                >
                  <option value="">강사를 선택하세요</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* 스케줄 (배열) 설정 영역 */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold">
                    수업 요일 및 시간
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleRow}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm font-bold hover:bg-indigo-200 transition-colors"
                  >
                    + 시간표 추가
                  </button>
                </div>

                {schedules.map((sch, index) => (
                  <div
                    key={index}
                    className="flex gap-2 mb-2 items-center bg-white p-2 rounded border"
                  >
                    <select
                      value={sch.dayOfWeek}
                      onChange={(e) =>
                        handleScheduleChange(index, "dayOfWeek", e.target.value)
                      }
                      className="border p-2 rounded bg-gray-50"
                    >
                      <option value={0}>일요일</option>
                      <option value={1}>월요일</option>
                      <option value={2}>화요일</option>
                      <option value={3}>수요일</option>
                      <option value={4}>목요일</option>
                      <option value={5}>금요일</option>
                      <option value={6}>토요일</option>
                    </select>
                    <input
                      type="time"
                      value={sch.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      className="border p-2 rounded bg-gray-50"
                      required
                    />
                    <span className="font-bold text-gray-500">~</span>
                    <input
                      type="time"
                      value={sch.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      className="border p-2 rounded bg-gray-50"
                      required
                    />
                    {schedules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleRow(index)}
                        className="text-red-500 font-bold ml-4 hover:text-red-700"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  개설 완료
                </button>
              </div>
            </form>
          </div>

          {/* 현재 개설된 강좌 목록 테이블 */}
          <div>
            <h3 className="font-bold text-lg mb-3">현재 개설된 강좌 목록</h3>
            {course.classes && course.classes.length > 0 ? (
              <div className="border rounded overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border-b">강좌 이름</th>
                      <th className="p-3 border-b">담당 강사</th>
                      <th className="p-3 border-b">기간</th>
                      <th className="p-3 border-b">수강 인원</th>
                      <th className="p-3 border-b">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.classes.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{c.name}</td>
                        <td className="p-3">
                          {c.instructor?.name || "미배정"}
                        </td>
                        <td className="p-3 text-xs text-gray-600">
                          {new Date(c.startDate).toLocaleDateString()} ~{" "}
                          {new Date(c.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-xs text-gray-600">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                            {c._count?.enrollments || 0} / {c.capacity} 명
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-600">
                          <button
                            onClick={() => setEnrollmentClass(c)}
                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded font-bold hover:bg-indigo-200 mr-2"
                          >
                            수강생 관리
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  `'${c.name}' 강좌를 삭제하시겠습니까?`,
                                )
                              )
                                return;
                              try {
                                const res = await fetch(
                                  `http://localhost:5001/api/classes/${c.id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
                                    },
                                  },
                                );
                                if (res.ok) {
                                  alert("삭제되었습니다.");
                                  if (onUpdate) onUpdate();
                                } else {
                                  alert("삭제 실패");
                                }
                              } catch (error) {
                                console.error(error);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-bold"
                          >
                            강좌 삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 border rounded bg-gray-50">
                현재 개설된 강좌가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 수강생 관리 서브 모달 렌더링 */}
      {enrollmentClass && (
        <AdminEnrollmentModal
          classData={enrollmentClass}
          onClose={() => setEnrollmentClass(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
