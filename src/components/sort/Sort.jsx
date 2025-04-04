import React, { useState } from 'react'
import './sort.css';

const Sort = ({ onSortChange }) => {  
      const [sortBy, setSortBy] = useState('price_asc');

      const handleSortChange = (value) => {
          setSortBy(value);
          onSortChange(value);
      };
      return (
          <div className="filter__container">
              {/* Results Sorting */}
              <div className="filter__sort">
                  <select 
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="filter__select"
                  >
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="relative_value">Best Value</option>
                      <option value="date_asc">Date: Soonest</option>
                      <option value="date_desc">Date: Latest</option>
                  </select>
              </div>
          </div>
      );
}

export default Sort