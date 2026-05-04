import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "회원가입 실패");

      alert("성공적으로 가입되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">회원가입</h2>
          <p className="text-slate-500 mt-2">새로운 계정을 생성하세요</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 text-sm font-medium text-red-600 bg-red-50 rounded-xl border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              이름
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                placeholder="홍길동"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              이메일
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                placeholder="lms@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg shadow-blue-200 focus:ring-4 focus:ring-blue-100 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? "가입 중..." : "가입하기"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-slate-500 font-medium">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
