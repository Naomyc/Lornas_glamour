import React, { useEffect, useState } from "react";
import { getServices } from "../api/salonApi";
import "../styles/ServiceList.css";
const formatDuration = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? `${hrs} hr${hrs > 1 ? "s" : ""} ` : ""}${
    mins > 0 ? `${mins} min${mins > 1 ? "s" : ""}` : ""
  }`.trim();
};

const ServiceList = ({ expandedCategory,onServiceClick }) => {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        const allServices = response.data;

        const groupedByCategory = allServices.reduce((categoryGroups, currentService) => {
          const categoryName = currentService.category?.name || "Uncategorized";

          if (!categoryGroups[categoryName]) {
            categoryGroups[categoryName] = [];
          }
          categoryGroups[categoryName].push(currentService);
          return categoryGroups;
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

  return (
    <div className="service-list">
      {services[expandedCategory] && services[expandedCategory].length > 0 && (
        <div key={expandedCategory} className="service-category">
          <h3>{expandedCategory}</h3>
          <ul>
            {services[expandedCategory].map((service) => (
              <li
                key={service._id}
                onClick={() => onServiceClick && onServiceClick(service)}
                style={{ cursor: "pointer", borderBottom: "1px solid #ccc", padding: "10px" }}
              >
                <p><strong>{service.service_name}</strong></p>
                <p>Price: €{service.price}</p>
                <p>Duration: {formatDuration(service.duration)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
