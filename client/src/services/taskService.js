import api from "./api";

const taskService = {
  getMyTasks: async () => {
    const response = await api.get("/tasks/my");
    return response.data;
  },
  getAllTasks: async () => {
    const response = await api.get("/tasks/all");
    return response.data;
  },
  updateTaskStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/update-status/${taskId}`, { status });
    return response.data;
  }
};

export default taskService;
