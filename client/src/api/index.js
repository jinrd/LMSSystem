import axiosInstance from "./axiosInstance";

export const authAPI = {
  login: async (credentials) => {
    // axios는 기본적으로 JSON 응답 데이터를 `.data` 객체 안에 담아 반환합니다.
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await axiosInstance.post("/auth/reset-password", data);
    return response.data;
  }
};

export const termsAPI = {
  getTerms: async (type) => {
    const response = await axiosInstance.get(`/terms/${type}`);
    return response.data;
  },
};

export const noticeAPI = {
  getNotices: async (page = 1, limit = 20) => {
    // GET 쿼리 파라미터는 `params` 옵션으로 쉽게 전달 가능
    const response = await axiosInstance.get("/notices", {
      params: { page, limit },
    });
    return response.data;
  },
  getNoticeById: async (id) => {
    const response = await axiosInstance.get(`/notices/${id}`);
    return response.data;
  },
  createNotice: async (data) => {
    const response = await axiosInstance.post(`/notices`, data);
    return response.data;
  },
  updateNotice: async (id, data) => {
    const response = await axiosInstance.put(`/notices/${id}`, data);
    return response.data;
  },
  deleteNotice: async (id) => {
    const response = await axiosInstance.delete(`/notices/${id}`);
    return response.data;
  },
};

export const userAPI = {
  getUsers: async () => {
    const response = await axiosInstance.get(`/users`);
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await axiosInstance.put(`/users/${id}/role`, { role });
    return response.data;
  },
  getMe: async () => {
    const response = await axiosInstance.get(`/users/me`);
    return response.data;
  },
  updateMe: async (data) => {
    const response = await axiosInstance.put(`/users/me`, data);
    return response.data;
  },
  updateMyPassword: async (data) => {
    const response = await axiosInstance.put(`/users/me/password`, data);
    return response.data;
  },
};

export const assignmentAPI = {
  // 1. 특정 강의의 과제 목록 조회 (GET)
  getAssignments: async (classId) => {
    const response = await axiosInstance.get(`/assignments/class/${classId}`);
    return response.data;
  },

  // 2. 과제 출제 (선생님 전용, POST)
  createAssignment: async (classId, data) => {
    const response = await axiosInstance.post(`/assignments/class/${classId}`, data);
    return response.data;
  },

  // 3. 제출물 목록 조회 (선생님 전용, GET)
  getSubmissions: async (assignmentId) => {
    const response = await axiosInstance.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  // 4. 과제 채점 (선생님 전용, PUT)
  gradeSubmission: async (submissionId, data) => {
    const response = await axiosInstance.put(`/assignments/submissions/${submissionId}/grade`, data);
    return response.data;
  },

  // 5. 과제 제출 (학생 전용, POST - ★ 파일 업로드 핵심 ★)
  submitAssignment: async (assignmentId, formData) => {
    const response = await axiosInstance.post(
      `/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export const dashboardAPI = {
  getAdminSummary: async () => {
    const response = await axiosInstance.get("/dashboard/admin/summary");
    return response.data;
  }
};