import React from 'react';
import './search.css'

const Search = ({ shows, handleSetShows, searchTerm, handleSearchTerm }) => {
  return (
    <div className="search__container">
        <label className="search__label">Search for a show</label>
        <input type="text" name="name" className='search__box' placeholder='Hamilton . . .' value={searchTerm} onChange={(event) => handleSearchTerm(event)}/>
    </div>
  )
}

export default Search