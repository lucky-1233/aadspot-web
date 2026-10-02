import React from "react";

function CategoryList({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-container">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`category-card ${
            selectedCategory === category.name ? "active" : ""
          }`}
          onClick={() => setSelectedCategory(category.name)}
        >
          {category.image && <img src={category.image} alt={category.name} />}

          <div className="category-name">{category.name}</div>
        </button>
      ))}
    </div>
  );
}

export default CategoryList;
