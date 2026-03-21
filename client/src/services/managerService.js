import api from "./api";

const managerService = {
  getTeamEmployees: async () => {
    const response = await api.get("/manager/employees");
    return response.data;
  },
  createEmployee: async (data) => {
    const response = await api.post("/manager/employees", data);
    return response.data;
  },
  deleteEmployee: async (id) => {
    const response = await api.delete(`/manager/employees/${id}`);
    return response.data;
  },
  updateEmployee: async (id, data) => {
    const response = await api.put(`/manager/employees/${id}`, data);
    return response.data;
  },
  assignTask: async (data) => {
    const response = await api.post("/manager/tasks", data);
    return response.data;
  },
  getTeamTasks: async () => {
    const response = await api.get("/manager/tasks");
    return response.data;
  },
  getTeamAttendance: async () => {
    const response = await api.get("/manager/attendance");
    return response.data;
  }
};

export default managerService;
