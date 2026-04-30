import api from "./api";

const adminService = {
  getManagers: async () => {
    const response = await api.get("/admin/managers");
    return response.data;
  },
  createManager: async (data) => {
    const response = await api.post("/admin/managers", data);
    return response.data;
  },
  deleteManager: async (id) => {
    const response = await api.delete(`/admin/managers/${id}`);
    return response.data;
  },
  updateManager: async (id, data) => {
    const response = await api.put(`/admin/managers/${id}`, data);
    return response.data;
  },
  getAllEmployees: async () => {
    const response = await api.get("/admin/employees");
    return response.data;
  },
  createEmployee: async (data) => {
    const response = await api.post("/admin/employees", data);
    return response.data;
  },
  deleteEmployee: async (id) => {
    const response = await api.delete(`/admin/employees/${id}`);
    return response.data;
  },
  updateEmployee: async (id, data) => {
    const response = await api.put(`/admin/employees/${id}`, data);
    return response.data;
  },
  getAttendanceReports: async () => {
    const response = await api.get("/admin/attendance");
    return response.data;
  },
  getActivityLogs: async () => {
    const response = await api.get("/admin/activity");
    return response.data;
  }
};

export default adminService;

