import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getStaff } from "../api/salonApi";

const StaffAvailability = () => {
  const [staff, setStaff] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Load staff on mount with today's date
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const response = await getStaff(today);
        setStaff(response.data);
      } catch (error) {
        console.error("Failed to load staff", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // When user changes date
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setLoading(true);

    try {
      const formattedDate = date.toISOString().split("T")[0];
      const response = await getStaff(formattedDate);
      setStaff(response.data);
    } catch (error) {
      console.error("Failed to load staff for selected date", error);
    } finally {
      setLoading(false);
    }
  };

  // Render loading, no staff, or staff list
  if (loading) return <p>Loading staff...</p>;
  if (!staff.length) return <p>No staff available on this date.</p>;

  return (
    <div>
      <h2>Staff Availability</h2>

      {/* Date picker */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {/* Staff list */}
      <ul>
        {staff.map((s) => (
          <li key={s._id} style={{ marginBottom: "15px" }}>
            <strong>{s.name}</strong> (Active: {s.active ? "Yes" : "No"})<br />

            {/* Working Days */}
            Working Days:{" "}
            {s.availability?.workingDays?.length
              ? s.availability.workingDays
                  .map((d) => `${d.day} (${d.start} - ${d.end})`)
                  .join(", ")
              : "N/A"}
            <br />

            {/* Leaves */}
            Leaves:{" "}
            {s.availability?.leaves?.length ? (
              <ul>
                {s.availability.leaves.map((leave, i) => (
                  <li key={i}>
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()} ({leave.type})
                    {leave.notes ? ` - ${leave.notes}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              "None"
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffAvailability;
