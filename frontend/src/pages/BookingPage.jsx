import React, { useState, useEffect } from "react";
import Categories from "../components/Categories";
import ServiceList from "../components/ServiceList";
import BookingForm from "../components/BookingForm";
import { getServices, getStaff, submitBooking } from "../api/salonApi";
import "../styles/components.css";


const BookingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [servicesForCategory, setServicesForCategory] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const toggleCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setServicesForCategory([]);
    } else {
      setSelectedCategory(category);
      loadServices(category);
    }
    setSelectedServices([]);
  };

  const loadServices = async (category) => {
    try {
      const response = await getServices();
      const allServices = response.data;
      const filtered = allServices.filter(
        (s) => s.category?.name === category
      );
      setServicesForCategory(filtered);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServicesForCategory([]);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedServices([service]); // single select for now
    setCurrentStep(2); // move to date/time step
  };

  const handleBackToServices = () => {
    setCurrentStep(1);
    setSelectedServices([]);
  };

  return (
    <div className="booking-page">
      <h2>Book an Appointment</h2>

      {/* Step Navigation */}
      <div className="step-nav">
        <ul className="step-nav-list">
          <li
            onClick={() => setCurrentStep(1)}
            className={currentStep === 1 ? "active" : ""}
          >
            Service
          </li>
          <li
            onClick={() => selectedServices.length > 0 && setCurrentStep(2)}
            className={currentStep === 2 ? "active" : ""}
          >
            Date & Time
          </li>
          <li
            onClick={() => currentStep > 2 && setCurrentStep(3)}
            className={currentStep === 3 ? "active" : ""}
          >
            Staff
          </li>
          <li
            onClick={() => currentStep > 3 && setCurrentStep(4)}
            className={currentStep === 4 ? "active" : ""}
          >
            Contact
          </li>
          <li
            onClick={() => currentStep > 4 && setCurrentStep(5)}
            className={currentStep === 5 ? "active" : ""}
          >
            Confirmation
          </li>
        </ul>
      </div>

      {/* Step 1: Select Category and Service */}
      {currentStep === 1 && !selectedCategory && (
  <>
    <Categories
      expandedCategory={selectedCategory}
      toggleCategory={toggleCategory}
      showImage={false}
    />

    {/* Collapsed summary for no category */}
    <div className="service-summary-panel">
      <h4>Summary</h4>
      <p>Please select a category to see services here</p>
      <button className="continue-button" disabled>
        Continue to Book Time
      </button>
    </div>
  </>
)}


      {currentStep === 1 && selectedCategory && (
        <ServiceList
          expandedCategory={selectedCategory}
          services={servicesForCategory}
          onBack={() => toggleCategory(selectedCategory)}
          onServiceClick={handleServiceSelect}
        />
      )}
      

      {/* Steps 2 to 5 handled by BookingForm */}
      {currentStep > 1 && selectedServices.length > 0 && (
        <BookingForm
          selectedService={selectedServices[0]}
          fetchServices={getServices}
          fetchStaff={getStaff}
          submitBooking={submitBooking}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          onBackToServices={handleBackToServices}
        />
      )}
    </div>
  );
};

export default BookingPage;
