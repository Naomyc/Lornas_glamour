import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = ({ fetchServices, fetchStaff, submitBooking }) => {
  const [step, setStep] = useState(1);

  // service selection
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // date and time selection
  const [selectedDate, setSelectedDate] = useState(null);

  // staff selection
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [anyStaff, setAnyStaff] = useState(true);

  // contact information
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Load services
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching Services:", error);
      }
    }
    loadServices();
  }, [fetchServices]);

  // load staff
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    async function loadStaff() {
      setLoadingStaff(true);
      try {
        const data = await fetchStaff(selectedService.id, selectedDate);
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

  // validation helpers
  const validateStep = () => {
    switch (step) {
      case 1:
        return !!selectedService;
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

  // handle next button
  const handleNext = () => {
    if (!validateStep()) {
      alert("Please complete the current step before proceeding.");
      return; // stop here if not valid
    }
    setStep((prev) => prev + 1);
  };

  // handle back button
  const handleBack = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // handle submit button
  const handleSubmit = async () => {
    if (!validateStep()) {
      alert("Please fill all required information.");
      return;
    }
    const bookingData = {
      serviceId: selectedService.id,
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
      {step === 1 && (
        <div>
          <h2>Select a Service</h2>
          <ul>
            {services.map((service) => (
              <li key={service.id}>
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  style={{
                    fontWeight:
                      selectedService?.id === service.id ? "bold" : "normal",
                  }}
                >
                  {service.name} - €{service.price} - {service.duration} hrs
                </button>
              </li>
            ))}
          </ul>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Select Date and Time</h2>
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
          <button onClick={handleBack}>Back</button>
          <button disabled={!validateStep()} onClick={handleNext}>
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Select Staff</h2>
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
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Contact Information and Policies</h2>
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
        </div>
      )}

      {step === 5 && (
        <div>
          <h2>Booking Confirmed!</h2>
          <p>
            Thank you, {contactInfo.name}! Your booking for{" "}
            {selectedService.name} on {selectedDate.toLocaleString()}{" "}
            {anyStaff
              ? "with any available staff"
              : `with staff ID ${selectedStaffId}`}{" "}
            has been received.
          </p>
          <button
            onClick={() => {
              // Reset form to book again or navigate away
              setStep(1);
              setSelectedService(null);
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
        </div>
      )}
    </div>
  );
};

export default BookingForm;
