import React, { useState } from "react";
import Categories from "./Categories";
import ServiceList from "./ServiceList";

const SalonServices = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryName) => {
    setExpandedCategory(prev=>prev=== categoryName ? null: categoryName);
  };

  return (
    <div>
      <Categories
        expandedCategory={expandedCategory}
        toggleCategory={toggleCategory}
      />
      <ServiceList expandedCategory={expandedCategory} />
    </div>
  );
};

export default SalonServices;
