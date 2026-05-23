import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { authAPI } from "../../api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      return setErrorMsg("유효하지 않은 접근입니다. 비밀번호 찾기를 다시 시도해주세요.");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return setErrorMsg("비밀번호가 일치하지 않습니다.");
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: formData.newPassword });
      alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mesh-bg p-4">
      <div className="w-full max-w-md p-10 glass rounded-3xl z-10">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">새 비밀번호 설정</h2>
        <p className="text-slate-500 font-medium mb-8">안전한 새 비밀번호를 입력해주세요.</p>

        {errorMsg && <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50/80 rounded-2xl border border-red-100">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700"
              placeholder="새 비밀번호"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700"
              placeholder="새 비밀번호 확인"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? "변경 중..." : "비밀번호 변경하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
