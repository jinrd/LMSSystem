import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { authAPI } from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const data = await authAPI.login(formData);

      localStorage.setItem("lms_token", data.token);
      localStorage.setItem("role", data.role);
      
      if (data.status === "ON_LEAVE") {
        alert("현재 휴학 상태입니다. 대시보드 및 수강 접근이 제한됩니다.");
      }

      if (data.role === "ADMIN") {
        navigate("/users");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mesh-bg p-4 relative overflow-hidden">
      {/* 장식용 떠다니는 배경 요소 */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float mix-blend-multiply"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-float mix-blend-multiply" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-10 glass rounded-3xl z-10 animate-fade-in-up">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight mb-3">
            LMS <span className="text-gradient">로그인</span>
          </h2>
          <p className="text-slate-500 font-medium">시스템에 접속하세요</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50/80 rounded-2xl border border-red-100 backdrop-blur-sm animate-fade-in-up">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              이메일
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                placeholder="lms@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              비밀번호
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 focus:ring-4 focus:ring-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? "접속 중..." : "로그인"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          계정이 없으신가요?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
