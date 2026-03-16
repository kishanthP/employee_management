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
  getAllEmployees: async () => {
    const response = await api.get("/admin/employees");
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
