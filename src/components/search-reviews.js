import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import ReviewList from './ReviewList';

export const SearchReviews = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchReviews, setSearchReviews] = useState("");

  const handleSubmit = e => {
    e.preventDefault(); 
    if (!searchInput || searchInput === '') return;
    return fetch(`${API_BASE_URL}/reviews/?search=${searchInput}`)
      .then(res => { if (!res.ok) {
        return Promise.reject(res.statusText);
      }
      const searchReviews = res.json();
      setSearchReviews(searchReviews)
        return searchReviews;
      })
      .catch(err => {
        alert("We're sorry. Something went wrong.")
        console.log(err);
      });
  }

  return (
    <div className="search-section">
      <form 
        id="search-form"
        className="search-form"
        onSubmit={handleSubmit}
      >
        <div className="input-wrapper">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            type="search"
            id="search"
            name="search"
            className="search-input"
            placeholder="Search..."
            aria-labelledby="search input"  
          />
          <label 
            htmlFor="search"
            className="search-label"
          >
            <button
              className="search-btn" 
              aria-label="search-btn"
            >
              search
            </button>
          </label>
        </div>
      </form>

      <ReviewList searchReviews={searchReviews} />
    </div>

  )
}

export default SearchReviews;
