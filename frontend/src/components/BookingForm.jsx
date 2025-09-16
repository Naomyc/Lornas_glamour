import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";
import "../styles/BookingForm.css";

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const getNextHalfHour = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  now.setSeconds(0);
  now.setMilliseconds(0);

  if (minutes < 30) {
    now.setMinutes(30);
  } else {
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
  }

  return now;
};

const BookingForm = ({ selectedService, fetchStaff, submitBooking }) => {
  const [step, setStep] = useState(1);

  // Date and time selection
  const [selectedDate, setSelectedDate] = useState(null);

  // Staff selection
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [anyStaff, setAnyStaff] = useState(true);

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Load staff when service and date are selected
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    async function loadStaff() {
      setLoadingStaff(true);
      try {
        const data = await fetchStaff(selectedService._id, selectedDate);
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        setStaffList([]);
      } finally {
        setLoadingStaff(false);
      }
    }

    loadStaff();
  }, [selectedService, selectedDate, fetchStaff]);

  // Validate each step
  const validateStep = () => {
    switch (step) {
      case 1:
        return !!selectedDate;
      case 2:
        return anyStaff || (!!selectedStaffId && selectedStaffId !== "");
      case 3:
        return (
          contactInfo.name.trim() &&
          contactInfo.email.trim().toLowerCase() &&
          contactInfo.phone.trim() &&
          agreedToPolicy &&
          agreedToTerms
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      alert("Please complete the current step before proceeding.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      alert("Please fill all required information.");
      return;
    }

    const bookingData = {
      serviceId: selectedService._id,
      date: selectedDate,
      staffId: anyStaff ? null : selectedStaffId,
      contactInfo,
      agreedToPolicy,
      agreedToTerms,
    };

    try {
      await submitBooking(bookingData);
      setStep(4);
    } catch (error) {
      alert("Failed to submit booking. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="booking-form">
      <h2>Booking for: {selectedService.service_name || selectedService.name}</h2>

      {step === 1 && (
        <>
          <h3>Select Date and Time</h3>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            showTimeSelect
            timeIntervals={30}
            minDate={new Date()}
            minTime={
              selectedDate && isToday(selectedDate)
                ? getNextHalfHour()
                : setHours(setMinutes(new Date(), 0), 10)
            }
            maxTime={
              selectedDate
                ? setHours(setMinutes(new Date(selectedDate), 0), 22)
                : setHours(setMinutes(new Date(), 0), 22)
            }
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Pick a date and time"
          />
          <br />
          <button onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Select Staff</h3>
          <div className="radio-group">
          <label>
            <input
              type="radio"
              checked={anyStaff}
              onChange={() => setAnyStaff(true)}
            />
            Any Available Staff
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input
              type="radio"
              checked={!anyStaff}
              onChange={() => setAnyStaff(false)}
            />
            Choose Specific Staff
          </label></div>
          {!anyStaff &&
            (loadingStaff ? (
              <p>Loading Staff...</p>
            ) : staffList.length === 0 ? (
              <p>No staff available for selected time.</p>
            ) : (
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
              >
                <option value="">-- Select Staff --</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            ))}
          <br />
          <button onClick={handleBack} disabled={step === 1}>
            Back
          </button>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Contact Information and Policies</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                value={contactInfo.name}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, name: e.target.value })
                }
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                required
              />
            </label>
            <br />
            <label>
              Phone:
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
                required
              />
            </label>
            <br />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedToPolicy}
                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                required
              />
              I agree to the{" "}
              <a href="/policies" target="_blank" rel="noreferrer">
                Cancellation and Deposit Policy
              </a>
              .
            </label>
            <br />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              I accept the{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            </label>
            <br />
            <button onClick={handleBack} disabled={step === 1}>
              Back
            </button>
            <button type="submit" disabled={!validateStep()}>
              Confirm Booking
            </button>
          </form>
        </>
      )}

      {step === 4 && (
        <>
          <h2>Booking Confirmed!</h2>
          <p>
            Thank you, {contactInfo.name}! Your booking for{" "}
            {selectedService.service_name || selectedService.name} on{" "}
            {selectedDate.toLocaleString()}{" "}
            {anyStaff
              ? "with any available staff"
              : `with staff ID ${selectedStaffId}`}{" "}
            has been received.
          </p>
          <button
            onClick={() => {
              // Reset form to book again or navigate away
              setStep(1);
              setSelectedDate(null);
              setSelectedStaffId("");
              setContactInfo({ name: "", email: "", phone: "" });
              setAgreedToPolicy(false);
              setAgreedToTerms(false);
              setAnyStaff(true);
            }}
          >
            Book another Appointment
          </button>
        </>
      )}
    </div>
  );
};

export default BookingForm;
