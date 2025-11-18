import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import Categories from "./Categories";
import ServiceList from "./ServiceList";
import { use } from "react";

const SalonServices = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate=useNavigate();

  const toggleCategory = (categoryName) => {
    setExpandedCategory(prev=>prev=== categoryName ? null: categoryName);
  };
  const handleBookNow = (service) => {
    navigate("/booking");
  };

  return (
    <div>
      <Categories
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
      />
      <ServiceList expandedCategory={expandedCategory} showSummary={false} mode="home" onBookNowClick={handleBookNow} />
    </div>
  );
};

export default SalonServices;
