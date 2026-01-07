import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllStaff,
  getStaffAvailableDates,
  getAvailableTimes,
} from "../api/salonApi";
import { setHours, setMinutes } from "date-fns";
import "../styles/components.css";

const BookingForm = ({
  selectedService,
  selectedAddOns = [],
  submitBooking,
  currentStep,
  setCurrentStep,
  onBackToServices,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [anyStaff, setAnyStaff] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load all staff on mount
  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const res = await getAllStaff();
        setStaffList(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, []);

  // Fetch available dates whenever a specific staff is selected
  useEffect(() => {
    if (anyStaff) {
      setAvailableDates([]);
      setSelectedDate(null);
      setAvailableTimes([]);
      return;
    }
    if (!selectedStaffId) return;

    const fetchDates = async () => {
      setLoadingStaff(true);
      try {
        const res = await getStaffAvailableDates(selectedStaffId);
        const dates = res.data.map((d) => new Date(d));
        setAvailableDates(dates);
        setSelectedDate(null);
        setAvailableTimes([]);
      } catch (err) {
        console.error("Error fetching staff dates:", err);
        setAvailableDates([]);
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchDates();
  }, [selectedStaffId, anyStaff]);

  // Fetch available times whenever date or staff changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchTimes = async () => {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const staffParam = anyStaff ? "" : selectedStaffId;
        const res = await getAvailableTimes(dateStr, staffParam);
        setAvailableTimes(res.data.availableSlots); // ["10:00", "10:30", ...]
      } catch (err) {
        console.error("Error fetching available times:", err);
        setAvailableTimes([]);
      }
    };
    fetchTimes();
  }, [selectedDate, selectedStaffId, anyStaff]);

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""} ` : ""}${
      mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""
    }`.trim();
  };

  return (
    <div className="booking-form">
      {/* Step 1: Service Summary */}
      {currentStep === 1 && selectedService && (
        <>
          <h3 className="step-title">Selected Service</h3>
          <div className="service-summary">
            <p><strong>{selectedService.service_name}</strong></p>
            <p>Price: €{selectedService.price}</p>
            <p>Duration: {formatDuration(selectedService.duration)}</p>
          </div>
        </>
      )}

      {/* Step 2: Staff and Date/Time */}
      {currentStep === 2 && (
        <>
          <h3 className="step-title">Select Staff</h3>
          {loadingStaff ? (
            <p>Loading staff...</p>
          ) : (
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              {/* Anyone button */}
              <button
                type="button"
                style={{
                  padding: "8px 12px",
                  border: anyStaff ? "2px solid #000" : "1px solid #ccc",
                  backgroundColor: anyStaff ? "#000" : "#fff",
                  color: anyStaff ? "#fff" : "#000",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                onClick={() => {
                  setAnyStaff(true);
                  setSelectedStaffId("");
                  setSelectedDate(null);
                  setAvailableDates([]);
                  setAvailableTimes([]);
                }}
              >
                Anyone
              </button>

              {/* Staff buttons */}
              {staffList.map((staff) => (
                <button
                  key={staff._id}
                  type="button"
                  style={{
                    padding: "8px 12px",
                    border: selectedStaffId === staff._id ? "2px solid #000" : "1px solid #ccc",
                    backgroundColor: selectedStaffId === staff._id ? "#000" : "#fff",
                    color: selectedStaffId === staff._id ? "#fff" : "#000",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    setAnyStaff(false);
                    setSelectedStaffId(staff._id);
                    setSelectedDate(null);
                    setAvailableDates([]);
                    setAvailableTimes([]);
                  }}
                >
                  {staff.name}
                </button>
              ))}
            </div>
          )}

          <h3 className="step-title">Select Date & Time</h3>
          <DatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  showTimeSelect
  withPortal
  timeIntervals={30}
  minTime={setHours(setMinutes(new Date(), 0), 10)}
  maxTime={setHours(setMinutes(new Date(), 0), 22)}
  dateFormat="yyyy-MM-dd HH:mm"
  placeholderText="Pick a date and time"
  includeDates={anyStaff ? null : availableDates}
  
  includeTimes={availableTimes.map((t) => new Date(t))}
  scrollToTime={setHours(setMinutes(new Date(), 0), 10)}
/>


          <button
            className={`continue-btn ${!selectedDate ? "disabled" : ""}`}
            disabled={!selectedDate}
            onClick={() => setCurrentStep(3)}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 3: Contact Information */}
      {currentStep === 3 && (
        <>
          <h3 className="step-title">Contact Information</h3>
          <label className="contact-label">
            Name:
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
              className="contact-input"
            />
          </label>
          <label className="contact-label">
            Email:
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="contact-input"
            />
          </label>
          <label className="contact-label">
            Phone:
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="contact-input"
            />
          </label>

          <button
            className={`continue-btn ${!contactInfo.name || !contactInfo.email || !contactInfo.phone ? "disabled" : ""}`}
            disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
            onClick={async () => {
              const bookingData = {
                serviceSelection: selectedService.service_name,
                staffSelection: anyStaff ? null : selectedStaffId,
                appointmentAt: selectedDate.toISOString(),
                customer: contactInfo,
                addOns: selectedAddOns,
              };

              try {
                const res = await submitBooking(bookingData);
                console.log("Booking saved:", res.data);
                setCurrentStep(4);
              } catch (err) {
                console.error("Booking failed:", err);
                alert(err.response?.data?.message || "Booking failed. Please try again.");
              }
            }}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <>
          <h3 className="step-title">Confirmation</h3>
          <p>Your appointment has been confirmed!</p>
        </>
      )}
    </div>
  );
};

export default BookingForm;
