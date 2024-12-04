import React from "react";
import "./categories.css";

const Categories = ({ category, handleSetCategory, categoryOptions }) => {
  return (
    <div className="categories__container">
      <label className="categories__label"></label>
      <select
        name="category"
        className="categories__box"
        value={category}
        onChange={(event) => handleSetCategory(event)}
      >
        {categoryOptions?.map((category) => {
          return (
            <option className="categories__option" key={category} value={category}>
              {category}
            </option>
          )
        })}
      </select>
    </div>
  );
};

export default Categories;
