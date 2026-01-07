import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend base URL
});

// Services
export const getServices = () => api.get("/services");
export const getCategories = () => api.get("/api/categories");

// Staff
export const getAllStaff = () => api.get("/staff/");

// ✅ NEW: Fetch available dates for a specific staff
export const getStaffAvailableDates = (staffId) =>
  api.get(`/staff/${staffId}/available-dates`);

export const getAvailableTimes = (date, staffId = "") =>
  api.get("/staff/available-times", { params: { date, staffId } });


// ✅ Submit booking
export const submitBooking = (bookingData) =>
  api.post("/bookings", bookingData);
// ✅ Fetch all booked times (from your backend)
export const getBookedTimes = () => api.get("/api/booked-times");
