import React from "react";
import { Search, X } from "lucide-react";
import "./styles/search.scss";

const Searchcom = ({ searchTerm, setSearchTerm }) => {
  // ===== UTILITY FUNCTIONS =====

  /** Clear search input */
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  /** Handle search input change */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /** Handle search form submission */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Form submission handled by parent component via debounced search
  };

  return (
    <div className="search-component">
      {/* Search Form */}
      <form
        className="search-form"
        onSubmit={handleSearchSubmit}
        role="search"
        aria-label="Movie search"
      >
        <div className="search-input-wrapper">
          {/* Search Icon */}
          <div className="search-icon-container">
            <Search className="search-icon" aria-hidden="true" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            className="search-input"
            placeholder="Search through thousands of movies..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search for movies"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="clear-icon" />
            </button>
          )}
        </div>

        {/* Search Button for Mobile */}
        <button
          type="submit"
          className="search-submit-btn"
          aria-label="Submit search"
        >
          <Search className="submit-icon" />
          <span className="submit-text">Search</span>
        </button>
      </form>

      {/* Search Status/Feedback */}
      {searchTerm && (
        <div className="search-status">
          <p className="search-status-text">
            Searching for:{" "}
            <span className="search-term-display">"{searchTerm}"</span>
          </p>
        </div>
      )}

      {/* Search Suggestions/Quick Actions */}
      <div className="search-suggestions">
        <div className="quick-searches">
          <p className="suggestions-label">Popular searches:</p>
          <div className="suggestion-tags">
            {["Action", "Comedy", "Drama", "Horror", "Sci-Fi"].map((genre) => (
              <button
                key={genre}
                className="suggestion-tag"
                onClick={() => setSearchTerm(genre)}
                aria-label={`Search for ${genre} movies`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchcom;
