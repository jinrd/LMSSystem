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
