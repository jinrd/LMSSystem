/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Users,
  Mail,
  Calendar,
  User as UserIcon,
  Search,
  Trash2,
} from "lucide-react";
import { userAPI } from "../../api";

// 역할군 한글로 변경
const roleMap = {
  ADMIN: "원장",
  TEACHER: "강사",
  STUDENT: "수강생",
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("lms_token");

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("lms_token");
          alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "목록을 불러오지 못했습니다.");

        setUsers(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    navigate("/login");
  };

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("lms_token");

    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (!response.ok) {
        throw new Error("역할 변경에 실패했습니다.");
      }

      // 성공 시 화면의 사용자 목록도 업데이트
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      alert("역할이 성공적으로 변경되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("이 유저를 정말로 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.")) {
      return;
    }

    const token = localStorage.getItem("lms_token");

    try {
      const response = await fetch(
        `http://localhost:5001/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "사용자 삭제에 실패했습니다.");
      }

      // 성공 시 화면에서 해당 유저 제거
      setUsers(users.filter((user) => user.id !== userId));
      alert("사용자가 성공적으로 삭제되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  };

  // 검색어에 맞게 유저 필터링 기능
  const filteredUsers = users.filter(
    (user) => user.name.includes(searchTerm) || user.email.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">회원 목록</h1>
              <p className="text-slate-500 text-sm">
                LMS 시스템에 가입된 모든 사용자
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
        {/* 가입자 검색 UI 추가 */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색하세요..."
            className="w-full bg-transparent border-none outline-none text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {errorMsg ? (
          <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
            {errorMsg}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      직급
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      가입일
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        가입된 회원이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                              <UserIcon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-800">
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role || "STUDENT"}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none cursor-pointer"
                          >
                            <option value="ADMIN">{roleMap.ADMIN}</option>
                            <option value="TEACHER">{roleMap.TEACHER}</option>
                            <option value="STUDENT">{roleMap.STUDENT}</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(user.createdAt).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
