import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/LoadingSkeleton';

export default function Home() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        'http://127.0.0.1:8000/api/movies/'
      );

      setMovies(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heroMovies = movies.slice(0, 5);

  useEffect(() => {
    if (!heroMovies.length) return;

    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % heroMovies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroMovies.length]);

  const current = heroMovies[slide];

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/movies?search=${search}`);
    }
  };

  return (
    <div className="page">

      {/* HERO SECTION */}
      {current && (
        <div className="hero">
          {heroMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="hero-slide"
              style={{
                opacity: index === slide ? 1 : 0,
                zIndex: index === slide ? 1 : 0
              }}
            >
              <img
                src={movie.banner}
                alt={movie.title}
              />
            </div>
          ))}

          <div className="hero-content">
            <div className="hero-badge">
              🔥 Now Showing
            </div>

            <h1 className="hero-title">
              {current.title}
            </h1>

            <div className="hero-meta">
              <span className="hero-rating">
                ⭐ {current.rating}/10
              </span>

              <span className="hero-tag">
                {current.genre}
              </span>

              <span className="hero-tag">
                🕐 {current.duration}
              </span>

              <span className="hero-tag">
                🌐 {current.language}
              </span>
            </div>

            <p className="hero-desc">
              {current.description}
            </p>

            <div className="flex gap-3">
              <button
                className="btn btn-primary btn-lg"
                onClick={() =>
                  navigate(`/movie/${current.id}`)
                }
              >
                🎬 Book Tickets
              </button>

              {current.trailer_url && (
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() =>
                    window.open(current.trailer_url, '_blank')
                  }
                >
                  ▶ Trailer
                </button>
              )}
            </div>
          </div>

          <div className="hero-dots">
            {heroMovies.map((_, index) => (
              <div
                key={index}
                className={`hero-dot ${
                  slide === index ? 'active' : ''
                }`}
                onClick={() => setSlide(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div
        className="section"
        style={{
          paddingTop: '2rem',
          paddingBottom: '1rem'
        }}
      >
        <form onSubmit={handleSearch}>
          <div
            className="search-bar"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0.85rem 1.25rem'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>
              🔍
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search movies..."
            />

            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* MOVIES */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            🎬 All <span>Movies</span>
          </h2>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/movies')}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="movies-grid">
            {movies.slice(0, 8).map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </div>

      {/* FEATURES */}
      <div className="section">
        <div
          className="grid-4"
          style={{ textAlign: 'center' }}
        >
          {[
            {
              icon: '🎭',
              title: 'All Genres',
              desc: 'Action, Drama, Comedy & More'
            },
            {
              icon: '💺',
              title: 'Seat Selection',
              desc: 'Choose your perfect seats'
            },
            {
              icon: '💳',
              title: 'Secure Payment',
              desc: 'Fast & Safe Checkout'
            },
            {
              icon: '📱',
              title: 'E-Tickets',
              desc: 'Instant QR Tickets'
            }
          ].map(item => (
            <div
              key={item.title}
              className="card"
            >
              <div
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '0.75rem'
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: '0.4rem'
                }}
              >
                {item.title}
              </div>

              <div className="text-muted text-sm">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: '1.6rem',
            color: 'var(--accent)'
          }}
        >
          CINE
          <span style={{ color: 'var(--gold)' }}>
            RUSH
          </span>
        </div>

        <p>
          © 2026 CineRush. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}