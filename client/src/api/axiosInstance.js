import axios from "axios";

// Axios 기본 인스턴스 생성 (URL 하드코딩 제거)
const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 5000,
});

// 요청(Request) 인터셉터: API 요청을 보낼 때마다 자동으로 토큰을 헤더에 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("lms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답(Response) 인터셉터: 서버 응답 에러 공통 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized (토큰 만료 등) 시 로컬 스토리지 비우고 로그인 페이지로 이동 처리 가능
    if (error.response && error.response.status === 401) {
      console.warn("인증이 만료되었습니다. 다시 로그인해주세요.");
      // 필요한 경우 아래 주석 해제하여 자동 로그아웃 처리
      // localStorage.removeItem("lms_token");
      // localStorage.removeItem("role");
      // window.location.href = "/";
    }
    
    // 서버에서 AppError로 보낸 error.message 추출 (Axios는 error.response.data에 담겨옴)
    const customErrorMessage = error.response?.data?.error || "요청 중 오류가 발생했습니다.";
    return Promise.reject(new Error(customErrorMessage));
  }
);

export default axiosInstance;
