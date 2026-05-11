import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import TermsModal from "../../components/TermsModal";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    termsAgreed: false,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Terms 모달 상태
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    content: "",
    isLoading: false,
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 팝업 열기 핸들러 (route 의 api 호출하여 내용 가져오기)
  const openTermsModal = async (type) => {
    const title = type === "privacy" ? "개인정보 처리방침" : "이용약관";

    setModalConfig({
      isOpen: true,
      title,
      content: "",
      isLoading: true,
    });

    try {
      const response = await fetch(`http://localhost:5001/api/terms/${type}`);

      const data = await response.json();

      if (!response.ok) throw new Error("약관을 불러오는데 실패했습니다.");

      setModalConfig((prev) => ({
        ...prev,
        content: data.content,
        isLoading: false,
      }));
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setModalConfig((prev) => ({
        ...prev,
        content: '<p class="text-red-500">약관 내용을 불러오지 못했습니다.</p>',
        isLoading: false,
      }));
    }
  };

  const closeTermsModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    // 프론트엔드 1차 검증
    if (!formData.termsAgreed) {
      setErrorMsg("이용약관에 동의해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.register(formData);

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
          {/* 약관 동의 체크박스 영역 */}
          <div className="flex items-start mt-6 bg-gray-50 p-4 rounded=md border border-gray-200">
            <div className="flex items-center h-5">
              <input
                id="termsAgreed"
                name="termsAgreed"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                checked={formData.termsAgreed}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="termsAgreed"
                className="font-medium text-gray-700 cursor-pointer select-none"
              >
                필수 약관 동의
              </label>
              <p className="text-gray-500 mt-1">
                LMS의{" "}
                <button
                  type="button"
                  onClick={() => openTermsModal("service")}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  이용약관
                </button>{" "}
                및{" "}
                <button
                  type="button"
                  onClick={() => openTermsModal("privacy")}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  개인정보 처리방침
                </button>
                을 읽었으며 이에 동의합니다.
              </p>
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
      <TermsModal
        isOpen={modalConfig.isOpen}
        onClose={closeTermsModal}
        title={modalConfig.title}
        content={modalConfig.content}
        isLoading={modalConfig.isLoading}
      />
    </div>
  );
}
