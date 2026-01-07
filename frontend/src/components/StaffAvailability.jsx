import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllStaff, getStaffAvailableDates } from "../api/salonApi";

const StaffAvailability = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);

  // Load all staff on mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getAllStaff();
        setStaff(response.data);
      } catch (error) {
        console.error("Failed to load staff", error);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  // Fetch available dates when a staff is selected
  useEffect(() => {
    if (!selectedStaffId) return;

    const fetchDates = async () => {
      setLoadingDates(true);
      try {
        const response = await getStaffAvailableDates(selectedStaffId);
        setAvailableDates(response.data);
        setSelectedDate(null); // reset selected date
      } catch (error) {
        console.error("Failed to load available dates", error);
      } finally {
        setLoadingDates(false);
      }
    };
    fetchDates();
  }, [selectedStaffId]);

  if (loadingStaff) return <p>Loading staff...</p>;

  return (
    <div>
      <h2>Staff Availability</h2>

      {/* Staff Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          style={{
            backgroundColor: selectedStaffId === null ? "#007bff" : "#ccc",
            color: selectedStaffId === null ? "#fff" : "#000",
          }}
          onClick={() => setSelectedStaffId(null)}
        >
          Anyone
        </button>
        {staff.map((s) => (
          <button
            key={s._id}
            style={{
              backgroundColor: selectedStaffId === s._id ? "#007bff" : "#ccc",
              color: selectedStaffId === s._id ? "#fff" : "#000",
            }}
            onClick={() => setSelectedStaffId(s._id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Date Picker */}
      {selectedStaffId !== null && (
        <div style={{ marginBottom: "20px" }}>
          {loadingDates ? (
            <p>Loading available dates...</p>
          ) : availableDates.length ? (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              includeDates={availableDates.map((d) => new Date(d))}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select an available date"
            />
          ) : (
            <p>No available dates for this staff.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffAvailability;
