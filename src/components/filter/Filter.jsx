import React, { useState } from 'react';
import './filter.css';

const Filter = ({ onSearch, onSortChange }) => {
    const [searchParams, setSearchParams] = useState({
        startDate: '',
        endDate: '',
        searchTerm: '',
        category: 'all'
    });

    const [sortBy, setSortBy] = useState('price_asc');

    const handleSearchParamChange = (field, value) => {
        const newParams = { ...searchParams, [field]: value };
        setSearchParams(newParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchParams);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        onSortChange(value);
    };

    return (
        <div className="filter__container">
            <form onSubmit={handleSearch} className="filter__search-form">
                {/* Search Bar */}
                <div className="filter__search">
                    <input
                        type="text"
                        placeholder="Search for events, teams, or venues..."
                        value={searchParams.searchTerm}
                        onChange={(e) => handleSearchParamChange('searchTerm', e.target.value)}
                        className="filter__search-input"
                    />
                </div>

                <div className="filter__controls">
                    {/* Date Range Picker */}
                    <div className="filter__control filter__date-range">
                        <input
                            type="date"
                            value={searchParams.startDate}
                            onChange={(e) => handleSearchParamChange('startDate', e.target.value)}
                            className="filter__date-input"
                        />
                        <span className="filter__date-separator">to</span>
                        <input
                            type="date"
                            value={searchParams.endDate}
                            onChange={(e) => handleSearchParamChange('endDate', e.target.value)}
                            className="filter__date-input"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="filter__control">
                        <select 
                            value={searchParams.category}
                            onChange={(e) => handleSearchParamChange('category', e.target.value)}
                            className="filter__select"
                        >
                            <option value="all">All Categories</option>
                            <option value="broadway">Broadway</option>
                            <option value="concerts">Concerts</option>
                            <option value="sports">Sports</option>
                            <option value="comedy">Comedy</option>
                        </select>
                    </div>

                    <button type="submit" className="filter__search-button">
                        Search
                    </button>
                </div>
            </form>

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
};

export default Filter;