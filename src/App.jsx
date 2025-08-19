import { Search } from "lucide-react";
import Searchcom from "./components/search";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import MovieCard from "./components/movieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import "./App.scss";

const App = () => {
  // ===== STATE DECLARATIONS =====
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term to prevent excessive API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // ===== API CONFIGURATIONS (DO NOT MODIFY) =====
  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  // ===== API METHODS (DO NOT MODIFY) =====
  const fetchMovies = async (query = "") => {
    setError(null);
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setLoading(false);
      setError(null);
      const data = await response.json();
      setMovies(data.results);
      if (query && data.results.length > 0 && data.results[0].id) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch movies. Please try again later.");
      console.error("Error fetching movies:", error);
      setError(
        "Failed to fetch movies. Please try again later." || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies: ", error);
    }
  };

  // ===== EFFECTS (DO NOT MODIFY) =====
  useEffect(() => {
    fetchMovies(searchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // ===== UI STATE COMPONENTS =====

  /** Loading State - Shows spinner and loading message */
  const LoadingState = () => (
    <div className="loading-state">
      <div className="loading-content">
        <Loader className="loading-spinner" />
        <p className="loading-text">Discovering amazing movies...</p>
      </div>
    </div>
  );

  /** Error State - Shows error message with retry option */
  const ErrorState = () => (
    <div className="error-state">
      <div className="error-content">
        <div className="error-icon">
          <span role="img" aria-label="Warning">
            ⚠️
          </span>
        </div>
        <h3 className="error-title">Oops! Something went wrong</h3>
        <p className="error-message">{error}</p>
        <button
          className="error-retry-btn"
          onClick={() => fetchMovies(searchTerm)}
          aria-label="Retry loading movies"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  /** Empty State - Shows when no movies are found */
  const EmptyState = () => (
    <div className="empty-state">
      <div className="empty-content">
        <div className="empty-icon">
          <span role="img" aria-label="Movie camera">
            🎬
          </span>
        </div>
        <h3 className="empty-title">No movies found</h3>
        <p className="empty-description">
          Try searching for a different movie title or check your spelling
        </p>
        <button
          className="empty-clear-btn"
          onClick={() => setSearchTerm("")}
          aria-label="Clear search and show all movies"
        >
          Show All Movies
        </button>
      </div>
    </div>
  );

  /** Movies Grid - Displays the main movies collection */
  const MoviesGrid = () => (
    <div className="movies-grid" role="grid" aria-label="Movies collection">
      {movies.length === 0 && !loading ? (
        <EmptyState />
      ) : (
        movies.map((movie) => (
          <div key={movie.id} role="gridcell">
            <MovieCard movie={movie} />
          </div>
        ))
      )}
    </div>
  );

  /** Trending Section - Shows trending movies horizontally */
  const TrendingSection = () => (
    <section className="trending-section" aria-labelledby="trending-heading">
      <div className="section-header">
        <h2 id="trending-heading" className="section-title">
          <span className="trending-icon" role="img" aria-label="Fire">
            🔥
          </span>
          Trending Movies
        </h2>
        <div className="trending-badge">
          <span className="badge-text">Hot Right Now</span>
        </div>
      </div>

      <div className="trending-container">
        <div className="trending-scroll-wrapper">
          <ul className="trending-list" role="list">
            {trendingMovies.map((movie, index) => (
              <li
                key={movie.$id}
                className="trending-item"
                role="listitem"
                aria-label={`Trending movie ${index + 1}: ${movie.title}`}
              >
                <div className="trending-rank">
                  <span className="rank-number">#{index + 1}</span>
                  <div className="rank-indicator" />
                </div>

                <div className="trending-poster-wrapper">
                  <img
                    src={movie.poster_url || "/no-movie.png"}
                    alt={`${movie.title} movie poster`}
                    className="trending-poster"
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/no-movie.png")}
                  />

                  <div className="trending-overlay">
                    <h3 className="trending-movie-title">{movie.title}</h3>
                    <div className="trending-glow" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Scroll Indicators */}
      </div>
    </section>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="app">
      {/* Background Elements */}
      <div className="background-pattern" aria-hidden="true" />
      <div className="gradient-overlay" aria-hidden="true" />

      {/* Main Application Container */}
      <div className="app-container">
        {/* ===== HEADER SECTION ===== */}
        <header className="app-header" role="banner">
          <div className="hero-section">
            {/* Hero Background Images */}
            <div className="hero-images">
              <img
                className="hero-bg"
                src="./bg.jpg"
                alt="Cinema background atmosphere"
                loading="eager"
              />
              <img
                className="hero-main"
                src="./hero.jpg"
                alt="Featured cinematic scene"
                loading="eager"
              />
              <div className="hero-overlay" />
              <div className="hero-gradient" />
            </div>

            {/* Hero Content */}
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  <span className="title-main">Find</span>
                  <span className="title-highlight">Movies</span>
                  <span className="title-main">You'll Enjoy</span>
                  <span className="title-subtitle">Without the Hassle</span>
                </h1>

                <p className="hero-description">
                  Discover your next favorite film from thousands of movies
                </p>
              </div>

              {/* Search Component Wrapper */}
              <div className="search-section">
                <Searchcom
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="app-main" role="main">
          {/* Trending Movies Section */}
          {trendingMovies.length > 0 && <TrendingSection />}

          {/* All Movies Section */}
          <section className="movies-section" aria-labelledby="movies-heading">
            <div className="section-header">
              <h2 id="movies-heading" className="section-title">
                {searchTerm ? (
                  <>
                    Search Results for "
                    <span className="search-query">{searchTerm}</span>"
                  </>
                ) : (
                  "All Movies"
                )}
              </h2>

              {/* Results Count */}
              {!loading && !error && (
                <div className="results-info">
                  <span className="results-count">
                    {movies.length} {movies.length === 1 ? "movie" : "movies"}{" "}
                    found
                  </span>
                </div>
              )}
            </div>

            {/* Content States */}
            <div className="movies-content">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState />
              ) : (
                <MoviesGrid />
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <p className="footer-text">
          Powered by <span className="footer-highlight">TMDB</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
