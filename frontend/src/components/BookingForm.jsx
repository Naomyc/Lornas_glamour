import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ selectedService, fetchStaff, submitBooking }) => {
  // We do NOT manage selectedService here, it's passed as prop
  const [step, setStep] = useState(2); // start from step 2 since service is pre-selected

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
      case 2:
        return !!selectedDate;
      case 3:
        return anyStaff || (!!selectedStaffId && selectedStaffId !== "");
      case 4:
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
    setStep((prev) => (prev > 2 ? prev - 1 : prev)); // no going back before step 2 here
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
      setStep(5);
    } catch (error) {
      alert("Failed to submit booking. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Booking for: {selectedService.service_name || selectedService.name}</h2>

      {step === 2 && (
        <>
          <h3>Select Date and Time</h3>
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            showTimeSelect
            timeIntervals={30}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Pick a date and time"
          />
          <br />
          <button onClick={() => setStep(1)} disabled>
            Back
          </button>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Select Staff</h3>
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
          </label>
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
          <button onClick={handleBack}>Back</button>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 4 && (
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
            <label>
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
            <label>
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
              .
            </label>
            <br />
            <button type="button" onClick={handleBack}>
              Back
            </button>
            <button type="submit" disabled={!validateStep()}>
              Confirm Booking
            </button>
          </form>
        </>
      )}

      {step === 5 && (
        <>
          <h2>Booking Confirmed!</h2>
          <p>
            Thank you, {contactInfo.name}! Your booking for{" "}
            {selectedService.service_name || selectedService.name} on{" "}
            {selectedDate.toLocaleString()}{" "}
            {anyStaff
              ? "with any available staff"
              : `with staff ID ${selectedStaffId}`}
            {" "} has been received.
          </p>
          <button
            onClick={() => {
              // Reset form to book again or navigate away
              setStep(2);
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
