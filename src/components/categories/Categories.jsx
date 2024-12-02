import React from "react";
import "./categories.css";

const Categories = ({ category, handleSetCategory }) => {
  return (
    <div className="categories__container">
      <label className="categories__label"></label>
      <select
        name="category"
        className="categories__box"
        value={category}
        onChange={(event) => handleSetCategory(event)}
      >
        <option className="categories__option" value="broadway">
          Broadway
        </option>
        <option className="categories__option" value="concerts">
          Concerts
        </option>
        <option className="categories__option" value="yankees">
          Yankees
        </option>
        <option className="categories__option" value="world_cup_2026">
          World Cup
        </option>
        <option className="categories__option" value="football">
          NY Football
        </option>
        <option className="categories__option" value="basketball">
          NY Basketball
        </option>
      </select>
    </div>
  );
};

export default Categories;
