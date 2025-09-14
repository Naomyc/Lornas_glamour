import React, { useEffect, useState } from "react";
import { getCategories } from "../api/salonApi";
import "../styles/Categories.css";

const Categories = ({ expandedCategory, toggleCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="categories-container">
      <h2>Our Services</h2>
      <div className="cards-row">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`category-card ${
              expandedCategory===cat.name ? "expanded" : ""
            }`}
            onClick={() => toggleCategory(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={cat.imageUrl} alt={cat.name} className="category-image" />
            <p className="category-name">{cat.name}</p>
            <div>{expandedCategory===cat.name ? "▲" : "▼"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
