import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  adminSignup: async (data) => {
    const response = await api.post("/auth/admin/signup", data);
    return response.data;
  }
};

export default authService;
