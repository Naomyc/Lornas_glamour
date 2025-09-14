import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ serviceId, fetchStaff }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStaff() {
      setLoading(true);
      try {
        // fetchStaff is a function you provide that calls your backend API to get staff
        const data = await fetchStaff(serviceId);
        setStaffList(data);
      } catch (error) {
        console.error("Error loading staff", error);
        setStaffList([]);
      } finally {
        setLoading(false);
      }
    }

    loadStaff();
  }, [serviceId, fetchStaff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedStaffId) {
      alert("Please select date/time and staff");
      return;
    }
    alert(`Booking on ${selectedDate} with staff ID ${selectedStaffId}`);
    // Here you will send booking data to backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Select Date and Time:
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          showTimeSelect
          timeIntervals={30}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Pick a date and time"
          required
        />
      </label>

      <br />

      <label>
        Select Staff:
        {loading ? (
          <p>Loading staff...</p>
        ) : (
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            required
          >
            <option value="">-- Select Staff --</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff.staffId}>
                {staff.name}
              </option>
            ))}
          </select>
        )}
      </label>

      <br />

      <button type="submit">Confirm Booking</button>
    </form>
  );
};

export default BookingForm;
