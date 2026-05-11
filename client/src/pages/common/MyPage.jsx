/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from "react";

export default function MyPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 비밀번호 변경 관련 상태
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
        setEditName(data.name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("[저장하기] 폼 제출 (PUT /api/users/me 호출 시작)");
    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("http://localhost:5001/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        alert("정보가 성공적으로 수정되었습니다.");
        setIsEditing(false);
        fetchMyInfo(); // 수정 후 최신 데이터 다시 불러오기
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    console.log("[비밀번호 변경] 폼 제출 시도됨");

    if (newPassword !== confirmPassword) {
      return alert("새 비밀번호가 서로 일치하지 않습니다.");
    }
    if (newPassword.length < 6) {
      return alert("새 비밀번호는 6자리 이상이어야 합니다.");
    }

    try {
      const token = localStorage.getItem("lms_token");
      const res = await fetch("http://localhost:5001/api/users/me/password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.\n안전을 위해 다시 로그인해주세요.");
        localStorage.removeItem("lms_token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      } else {
        const errorData = await res.json();
        alert(errorData.error || "비밀번호 변경 실패");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  if (!userInfo)
    return (
      <div className="p-8 text-center text-red-500">
        정보를 불러올 수 없습니다.
      </div>
    );

  // 권한별 뱃지 색상
  const roleBadgeColor = {
    ADMIN: "bg-red-100 text-red-800",
    TEACHER: "bg-green-100 text-green-800",
    STUDENT: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h1>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-8 border-b pb-8">
          {/* 아바타 (임시 UI) */}
          <div
            className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center
 text-3xl font-bold"
          >
            {userInfo.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{userInfo.name} 님</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${roleBadgeColor[userInfo.role]}`}
              >
                {userInfo.role}
              </span>
            </div>
            <p className="text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        <div className="max-w-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">내 정보 수정</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={!isEditing}
                className="w-full border p-2 rounded-lg bg-gray-50 disabled:text-gray-500 disabled:border-gray-200
       focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이메일 (수정 불가)
              </label>
              <input
                type="email"
                value={userInfo.email}
                disabled
                className="w-full border p-2 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="pt-4 flex gap-2">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold
       hover:bg-indigo-700"
                  >
                    저장하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(userInfo.name);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // 폼 제출 이벤트 방지
                    console.log("[이름 변경하기] 버튼 클릭");
                    setIsEditing(true);
                  }}
                  className="px-6 py-2 border border-gray-300
       text-gray-700 rounded-lg font-bold hover:bg-gray-50"
                >
                  이름 변경하기
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 비밀번호 변경 구역 */}
        <div className="max-w-md mt-12 pt-8 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">비밀번호 변경</h3>
            {!isChangingPassword && (
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
              >
                비밀번호 바꾸기
              </button>
            )}
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="6자리 이상 입력"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border p-2 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 w-full">
                  비밀번호 변경
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 w-full"
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
