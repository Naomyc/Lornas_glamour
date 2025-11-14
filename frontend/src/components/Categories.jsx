import React, { useEffect, useState } from "react";
import { getCategories } from "../api/salonApi";


const Categories = ({ expandedCategory, toggleCategory, showImage = true }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p className="error">{error}</p>;
  if (categories.length === 0) return <p>No categories available.</p>;

  const layoutClass = showImage ? "horizontal" : "vertical";

  return (
    <div className={`categories-container ${layoutClass}`}>
      <h2>Our Services</h2>
      <div className={`cards-row ${layoutClass}`}>
        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.name;

          return isExpanded ? (
            // Expanded View
            <button
              key={cat._id || cat.name}
              className="category-card expanded full-width"
              onClick={() => toggleCategory(cat.name)}
            >
              <div className="expanded-header">
                <span className="expand-arrow back">{"<"}</span>
                <p className="category-name">{cat.name}</p>
              </div>
            </button>
          ) : (
            // Collapsed Card
            <button
              key={cat._id || cat.name}
              className={`category-card ${showImage ? "with-image" : "no-image"}`}
              onClick={() => toggleCategory(cat.name)}
            >
              {showImage && (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="category-image"
                  onError={(e) => (e.target.src = "/default-category.png")}
                />
              )}
              <p className="category-name">{cat.name}</p>
              <span className="expand-arrow">{">"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
