import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend base URL
});

export const getServices = () => api.get("/services");
export const getCategories = () => api.get("/api/categories");

export const getStaff = (date) =>
  api.get(`/staff/available`, {
    params: { date },
  });

// ✅ Submit booking
export const submitBooking = (bookingData) =>
  api.post("/bookings", bookingData);