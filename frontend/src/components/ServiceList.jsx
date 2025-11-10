import React, { useEffect, useState } from "react";
import { getServices } from "../api/salonApi";
import "../styles/ServiceList.css";

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
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "10px",
          padding: "10px",
          cursor: "pointer",
          backgroundColor: isSelected ? "#e6f7ff" : "#fff",
        }}
        onClick={() =>
          isSelected ? setSelectedService(null) : setSelectedService(service)
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>{service.service_name}</strong>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>€{service.price}</span>
            <input type="checkbox" checked={isSelected} readOnly />
          </div>
        </div>
        <div
          style={{
            marginTop: "4px",
            color: "#555",
            fontSize: "0.9em",
          }}
        >
          Duration: {formatDuration(service.duration)}
        </div>
      </li>
    );
  };

  return (
    <div className="service-list" style={{ display: "flex", gap: "2rem" }}>
      {/* Left Panel */}
      <div style={{ flex: 1 }}>
        <button
          className="category-card expanded full-width"
          onClick={onBack}
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            border: "none",
            background: "transparent",
            padding: 0,
            textAlign: "left",
          }}
        >
          <div
            className="expanded-header"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span className="expand-arrow back">{"<"}</span>
            <p className="category-name" style={{ margin: 0 }}>
              {expandedCategory}
            </p>
          </div>
        </button>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {selectedService
            ? renderServiceCard(selectedService)
            : services[expandedCategory]?.map(renderServiceCard)}
        </ul>
      </div>

      {/* Right Panel: Summary */}
      {selectedService && (
        <div
          className="service-summary"
          style={{
            flexBasis: "300px",
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
            height: "fit-content",
          }}
        >
          <h4>Summary</h4>
          <p>
            <strong>{selectedService.service_name}</strong>
          </p>
          <p>Duration: {formatDuration(selectedService.duration)}</p>
          <p>Price: €{selectedService.price}</p>

          <button
            onClick={() => onServiceClick && onServiceClick(selectedService)}
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Continue to Book Time
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
