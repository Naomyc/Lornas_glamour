import React, { useState } from "react";
import Categories from "../components/Categories";
import ServiceList from "../components/ServiceList";
import BookingForm from "../components/BookingForm";
import { getServices, getStaff, submitBooking } from "../api/salonApi";
import "../styles/BookingForm.css";

const BookingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const toggleCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSelectedService(null); // Reset service when switching category
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  return (
    <div className="booking-form">
      <h2>Book an Appointment</h2>
      {!selectedService && (
        <>
          <Categories
            expandedCategory={selectedCategory}
            toggleCategory={toggleCategory}
          />
          <ServiceList
            expandedCategory={selectedCategory}
            onServiceClick={handleServiceSelect} // pass click handler
          />
        </>
      )}

      {selectedService && (
        <BookingForm
          selectedService={selectedService}
          fetchServices={getServices}
          fetchStaff={getStaff}
          submitBooking={submitBooking}
        />
      )}
    </div>
  );
};

export default BookingPage;
