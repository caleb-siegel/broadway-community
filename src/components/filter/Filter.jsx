import React from 'react';
import './filter.css';

const Filter = ({ active, handleActive }) => {

    return (
        <div className="filter__container">
            <button className={`${active === "all" ? 'active-filter' : ''} filter__item`} value={"all"} onClick={(event) => handleActive(event)}>All Dates</button>
            <button className={`${active === "today" ? 'active-filter' : ''} filter__item`} value={"today"} onClick={(event) => handleActive(event)}>Today</button>
            <button className={`${active === "7days" ? 'active-filter' : ''} filter__item`} value={"7days"} onClick={(event) => handleActive(event)}>7 Days</button>
        </div>
    )
}

export default Filter