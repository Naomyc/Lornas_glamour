import React, { useEffect, useState } from "react";
import { getServices } from "../api/salonApi";
import "../styles/components.css"; // make sure CSS below is included

const formatDuration = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""} ` : ""}${
    mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""
  }`.trim();
};

const ServiceList = ({ expandedCategory, onServiceClick, onBack }) => {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        const allServices = response.data;

        const groupedByCategory = allServices.reduce((groups, service) => {
          const category = service.category?.name || "Uncategorized";
          if (!groups[category]) groups[category] = [];
          groups[category].push(service);
          return groups;
        }, {});
        setServices(groupedByCategory);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (!expandedCategory) return <p>Please select a category to see services.</p>;

  const renderServiceCard = (service) => {
    const isSelected = selectedService && selectedService._id === service._id;

    return (
      <li
        key={service._id}
        className={`service-card ${isSelected ? "selected" : ""}`}
        onClick={() =>
          isSelected ? setSelectedService(null) : setSelectedService(service)
        }
      >
        <div className="service-card-header">
          <strong>{service.service_name}</strong>
          <div className="service-card-price">
            <span>€{service.price}</span>
            <input type="checkbox" checked={isSelected} readOnly />
          </div>
        </div>
        <div className="service-card-duration">
          Duration: {formatDuration(service.duration)}
        </div>
      </li>
    );
  };

  return (
    <div className="service-list-container">
      {/* Left Panel */}
      <div
        className={`service-list-panel ${
          expandedCategory ? "expanded" : "collapsed"
        }`}
      >
        <button className="back-button" onClick={onBack}>
          <div className="back-button-header">
            <span className="back-arrow">{"<"}</span>
            <p className="category-name">
              {expandedCategory ? "Select a service" : expandedCategory}
            </p>
          </div>
        </button>

        <ul className="service-list">
          {services[expandedCategory]?.map(renderServiceCard)}
        </ul>
      </div>

      {/* Right Panel: Summary */}
      <div className="service-summary-panel">
        <h4>Summary</h4>

        {!selectedService ? (
          <>
            <p>Start by selecting one or more services</p>
            <button className="continue-button" disabled>
              Continue to Book Time
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>{selectedService.service_name}</strong>
            </p>
            <p>Duration: {formatDuration(selectedService.duration)}</p>
            <p>Price: €{selectedService.price}</p>
            <button
              onClick={() => onServiceClick && onServiceClick(selectedService)}
              className="continue-button"
            >
              Continue to Book Time
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
