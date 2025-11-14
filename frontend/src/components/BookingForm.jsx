import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getStaff } from "../api/salonApi";
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
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [anyStaff, setAnyStaff] = useState(true);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // fetch staff when service + date selected
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    const fetchStaffList = async () => {
      setLoadingStaff(true);
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const response = await getStaff(formattedDate);
        setStaffList(response.data);
      } catch {
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchStaffList();
  }, [selectedService, selectedDate]);

  // format duration helper
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
            <p>
              <strong>{selectedService.service_name}</strong>
            </p>
            <p>Price: €{selectedService.price}</p>
            <p>Duration: {formatDuration(selectedService.duration)}</p>
          </div>
        </>
      )}

      {/* Step 2: Date & Time */}
      {currentStep === 2 && (
        <>
          <h3 className="step-title">Select Date and Time</h3>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            showTimeSelect
            timeIntervals={30}
            minDate={new Date()}
            minTime={setHours(setMinutes(new Date(), 0), 10)}
            maxTime={setHours(setMinutes(new Date(), 0), 22)}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Pick a date and time"
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

      {/* Step 3: Select Staff */}
      {currentStep === 3 && (
        <>
          <h3 className="step-title">Select Staff</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={anyStaff}
                onChange={() => setAnyStaff(true)}
              />
              Any Available Staff
            </label>
            <label className="radio-margin">
              <input
                type="radio"
                checked={!anyStaff}
                onChange={() => setAnyStaff(false)}
              />
              Choose Specific Staff
            </label>
          </div>
          {!anyStaff &&
            (loadingStaff ? (
              <p>Loading Staff...</p>
            ) : staffList.length === 0 ? (
              <p>No staff available for selected time.</p>
            ) : (
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="staff-select"
              >
                <option value="">-- Select Staff --</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            ))}
          <button
            className={`continue-btn ${!anyStaff && !selectedStaffId ? "disabled" : ""}`}
            disabled={!anyStaff && !selectedStaffId}
            onClick={() => setCurrentStep(4)}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 4: Contact Information */}
      {currentStep === 4 && (
        <>
          <h3 className="step-title">Contact Information</h3>
          <label className="contact-label">
            Name:
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, name: e.target.value })
              }
              className="contact-input"
            />
          </label>
          <label className="contact-label">
            Email:
            <input
              type="email"
              value={contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, email: e.target.value })
              }
              className="contact-input"
            />
          </label>
          <label className="contact-label">
            Phone:
            <input
              type="tel"
              value={contactInfo.phone}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, phone: e.target.value })
              }
              className="contact-input"
            />
          </label>
          <button
            className={`continue-btn ${!contactInfo.name || !contactInfo.email || !contactInfo.phone ? "disabled" : ""}`}
            disabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
            onClick={() => setCurrentStep(5)}
          >
            Continue
          </button>
        </>
      )}

      {/* Step 5: Confirmation */}
      {currentStep === 5 && (
        <>
          <h3 className="step-title">Confirmation</h3>
          <p>Your appointment has been confirmed!</p>
        </>
      )}
    </div>
  );
};

export default BookingForm;
