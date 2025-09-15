import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend base URL
});

export const getServices = () => api.get("/services");
export const getCategories = () => api.get("/api/categories");

export const getStaff = (serviceId, date) =>
  api.get(`/api/staff/available`, {
    params: { serviceId, date },
  });

// ✅ Submit booking
export const submitBooking = (bookingData) =>
  api.post("/api/bookings", bookingData);