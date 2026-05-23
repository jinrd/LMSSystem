import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { authAPI } from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await authAPI.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setErrorMsg(err.message || "이메일 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mesh-bg p-4">
      <div className="w-full max-w-md p-10 glass rounded-3xl z-10">
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> 로그인으로 돌아가기
        </Link>
        
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">비밀번호 찾기</h2>
        <p className="text-slate-500 font-medium mb-8">가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>

        {message && <div className="mb-6 p-4 text-sm font-semibold text-green-600 bg-green-50/80 rounded-2xl border border-green-100">{message}</div>}
        {errorMsg && <div className="mb-6 p-4 text-sm font-semibold text-red-600 bg-red-50/80 rounded-2xl border border-red-100">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-white/50 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all text-slate-700"
              placeholder="가입한 이메일 입력"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 text-white bg-slate-800 hover:bg-slate-900 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? "발송 중..." : "재설정 링크 받기"}
          </button>
        </form>
      </div>
    </div>
  );
}
