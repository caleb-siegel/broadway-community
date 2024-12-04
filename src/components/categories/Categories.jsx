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
        <option className="categories__option" value="Broadway">
          Broadway
        </option>
        <option className="categories__option" value="Concerts">
          Concerts
        </option>
        <option className="categories__option" value="Yankees">
          Yankees
        </option>
        <option className="categories__option" value="World Cup">
          World Cup
        </option>
        <option className="categories__option" value="Football">
          NY Football
        </option>
        <option className="categories__option" value="Basketball">
          NY Basketball
        </option>
      </select>
    </div>
  );
};

export default Categories;
