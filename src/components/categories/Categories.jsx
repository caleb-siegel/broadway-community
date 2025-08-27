import React, { useState, useEffect } from "react";
import "./categories.css";
import { useOutletContext } from "react-router-dom";
import { CircularProgress } from "@mui/material"; 

const Categories = ({ category, handleSetCategory }) => {
  const { backendUrl } = useOutletContext();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${backendUrl}/api/category_names`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryOptions(data);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="categories__container">
      <label className="categories__label"></label>
      <select
        name="category"
        className="categories__box"
        value={category}
        onChange={(event) => handleSetCategory(event)}
        disabled={isLoading}
      >
        {isLoading ? (
          <option>Loading...</option>
        ) : (
          categoryOptions?.map((category) => (
            <option 
              className="categories__option" 
              key={category.id} 
              value={category.name}
            >
              {category.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default Categories;
