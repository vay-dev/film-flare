import React, { useState } from "react";
import { Star, Calendar, Globe, ImageOff } from "lucide-react";

const MovieCard = ({
  movie: {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    overview,
  },
}) => {
  // ===== STATE FOR INTERACTIONS =====
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // ===== UTILITY FUNCTIONS =====

  /** Format rating for display */
  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : "N/A";
  };

  /** Extract year from release date */
  const getYear = (dateString) => {
    return dateString ? dateString.split("-")[0] : "N/A";
  };

  /** Get rating color based on score */
  const getRatingClass = (rating) => {
    if (!rating) return "rating-na";
    if (rating >= 8) return "rating-excellent";
    if (rating >= 7) return "rating-good";
    if (rating >= 6) return "rating-decent";
    return "rating-poor";
  };

  /** Handle image load success */
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  /** Handle image load error */
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // ===== POSTER COMPONENT =====
  const MoviePoster = () => (
    <div className="movie-poster-container">
      {/* Loading/Error States */}
      {!imageLoaded && !imageError && (
        <div className="poster-loading">
          <div className="poster-skeleton" />
        </div>
      )}

      {imageError && (
        <div className="poster-error">
          <ImageOff className="poster-error-icon" />
          <span className="poster-error-text">No Image</span>
        </div>
      )}

      {/* Main Poster Image */}
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={`${title} movie poster`}
        className={`movie-poster ${imageLoaded ? "loaded" : ""}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />

      {/* Poster Overlay Effects */}
      <div className="poster-overlay" />
      <div className="poster-shine" />
    </div>
  );

  // ===== MOVIE INFO COMPONENT =====
  const MovieInfo = () => (
    <div className="movie-info">
      {/* Movie Title */}
      <h3 className="movie-title" title={title}>
        {title}
      </h3>

      {/* Movie Metadata */}
      <div className="movie-metadata">
        {/* Rating Section */}
        <div className={`movie-rating ${getRatingClass(vote_average)}`}>
          <div className="rating-container">
            <Star className="rating-icon" fill="currentColor" />
            <span className="rating-value">{formatRating(vote_average)}</span>
          </div>
        </div>

        {/* Metadata Divider */}
        <span className="metadata-divider" aria-hidden="true">
          •
        </span>

        {/* Language Section */}
        <div className="movie-language">
          <Globe className="language-icon" />
          <span
            className="language-code"
            title={`Original language: ${original_language}`}
          >
            {original_language?.toUpperCase() || "N/A"}
          </span>
        </div>

        {/* Metadata Divider */}
        <span className="metadata-divider" aria-hidden="true">
          •
        </span>

        {/* Release Year Section */}
        <div className="movie-year">
          <Calendar className="year-icon" />
          <span className="year-value">{getYear(release_date)}</span>
        </div>
      </div>

      {/* Movie Overview (if available) */}
      {overview && (
        <p className="movie-overview" title={overview}>
          {overview.length > 120
            ? `${overview.substring(0, 120)}...`
            : overview}
        </p>
      )}
    </div>
  );

  return (
    <article
      className="movie-card"
      role="article"
      aria-labelledby={`movie-${title}`}
    >
      {/* Poster Section */}
      <MoviePoster />

      {/* Info Section */}
      <MovieInfo />

      {/* Interactive Elements */}
      <div className="movie-actions">
        <button
          className="action-btn primary"
          aria-label={`View details for ${title}`}
        >
          View Details
        </button>
        <button
          className="action-btn secondary"
          aria-label={`Add ${title} to watchlist`}
        >
          Watchlist
        </button>
      </div>

      {/* Card Hover Effect */}
      <div className="card-hover-effect" aria-hidden="true" />
    </article>
  );
};

export default MovieCard;
