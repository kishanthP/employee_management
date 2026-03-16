import api from "./api";

const attendanceService = {
  getMyAttendance: async () => {
    const response = await api.get("/attendance/my");
    return response.data;
  },
  checkIn: async () => {
    const response = await api.post("/attendance/checkin");
    return response.data;
  },
  checkOut: async () => {
    const response = await api.post("/attendance/checkout");
    return response.data;
  }
};

export default attendanceService;
