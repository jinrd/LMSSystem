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
  Phone,
} from "lucide-react";
import { userAPI } from "../../api";
import { formatPhoneNumber } from "../../utils/format";

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

  const handleStatusChange = async (userId, currentRole, newStatus) => {
    if (currentRole !== "STUDENT") {
      alert("학생 계정만 휴학 처리가 가능합니다.");
      return;
    }

    if (newStatus === "ON_LEAVE") {
      if (!window.confirm("휴학 처리 시 이 학생이 수강 중이던 모든 강의에서 제외되어 정원이 비워집니다.\n정말로 진행하시겠습니까?")) return;
    } else {
      if (!window.confirm("다시 재학(복학) 처리하시겠습니까?")) return;
    }

    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch(`http://localhost:5001/api/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user,
          ),
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || "상태 변경 실패");
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  // 검색어에 맞게 유저 필터링 기능
  const filteredUsers = users.filter(
    (user) => user.name.includes(searchTerm) || user.email.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">회원 목록</h1>
              <p className="text-slate-500 text-xs md:text-sm">
                LMS 시스템에 가입된 모든 사용자
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors w-full sm:w-auto justify-center"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
        {/* 가입자 검색 UI 추가 */}
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색하세요..."
            className="w-full bg-transparent border-none outline-none text-slate-700 text-sm md:text-base"
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
          <>
            {/* 모바일 뷰 (카드형) */}
            <div className="md:hidden flex flex-col gap-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center text-slate-500 py-8 bg-white rounded-2xl border border-slate-100">가입된 회원이 없습니다.</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-lg truncate">{user.name}</h3>
                          <p className="text-slate-500 text-xs flex items-center gap-1 truncate mt-0.5"><Mail className="w-3 h-3 shrink-0"/> <span className="truncate">{user.email}</span></p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">직급</p>
                        <select
                          value={user.role || "STUDENT"}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 block w-full p-2 outline-none"
                        >
                          <option value="ADMIN">{roleMap.ADMIN}</option>
                          <option value="TEACHER">{roleMap.TEACHER}</option>
                          <option value="STUDENT">{roleMap.STUDENT}</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">상태</p>
                        {user.role === "STUDENT" ? (
                          <select
                            value={user.status || "ACTIVE"}
                            onChange={(e) => handleStatusChange(user.id, user.role, e.target.value)}
                            className={`border text-sm rounded-lg block w-full p-2 outline-none font-bold ${
                              user.status === "ON_LEAVE" ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-blue-50 border-blue-200 text-blue-600"
                            }`}
                          >
                            <option value="ACTIVE">재학</option>
                            <option value="ON_LEAVE">휴학</option>
                          </select>
                        ) : (
                          <div className="text-slate-400 text-sm py-2 font-medium">해당 없음</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-1 border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.phone ? formatPhoneNumber(user.phone) : "없음"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(user.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* PC 뷰 (테이블형) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                      상태
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      연락처
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
                          {user.role === "STUDENT" ? (
                            <select
                              value={user.status || "ACTIVE"}
                              onChange={(e) => handleStatusChange(user.id, user.role, e.target.value)}
                              className={`border text-sm rounded-lg focus:ring-blue-500 block w-full p-2 outline-none cursor-pointer font-bold ${
                                user.status === "ON_LEAVE"
                                  ? "bg-orange-50 border-orange-200 text-orange-600"
                                  : "bg-blue-50 border-blue-200 text-blue-600"
                              }`}
                            >
                              <option value="ACTIVE">재학</option>
                              <option value="ON_LEAVE">휴학</option>
                            </select>
                          ) : (
                            <span className="text-slate-400 text-sm px-2 font-medium">해당 없음</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">{user.phone ? formatPhoneNumber(user.phone) : "없음"}</span>
                          </div>
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
          </>
        )}
      </div>
    </div>
  );
}
