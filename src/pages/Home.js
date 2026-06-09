import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/LoadingSkeleton';

const heroMovies = movies.filter(m => m.trending);

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroMovies.length), 5000);
    return () => clearInterval(t);
  }, []);

  const trending = movies.filter(m => m.trending);
  const upcoming = movies.filter(m => m.upcoming);
  const current = heroMovies[slide];

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/movies?search=${search}`);
  };

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        {heroMovies.map((m, i) => (
          <div key={m.id} className="hero-slide" style={{ opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }}>
            <img src={m.banner} alt={m.title} />
          </div>
        ))}
        <div className="hero-content">
          <div className="hero-badge">🔥 Now Showing</div>
          <h1 className="hero-title">{current?.title}</h1>
          <div className="hero-meta">
            <span className="hero-rating">⭐ {current?.rating}/10</span>
            {current?.genre.map(g => <span key={g} className="hero-tag">{g}</span>)}
            <span className="hero-tag">🕐 {current?.duration}</span>
          </div>
          <p className="hero-desc">{current?.description}</p>
          <div className="flex gap-3">
            <button className="btn btn-primary btn-lg" onClick={() => navigate(`/movie/${current?.id}`)}>
              🎬 Book Tickets
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate(`/movie/${current?.id}`)}>
              ▶ Trailer
            </button>
          </div>
        </div>
        <div className="hero-dots">
          {heroMovies.map((_, i) => (
            <div key={i} className={`hero-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="section" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <form onSubmit={handleSearch}>
          <div className="search-bar" style={{ maxWidth: '600px', margin: '0 auto', padding: '0.85rem 1.25rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for movies, genres, actors..."
              style={{ fontSize: '1rem' }}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </div>
        </form>
      </div>

      {/* Trending */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">🔥 Trending <span>Movies</span></h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/movies')}>View All →</button>
        </div>
        {loading ? <SkeletonGrid count={4} /> : (
          <div className="movies-grid">
            {trending.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">🗓 Coming <span>Soon</span></h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/movies?tab=upcoming')}>View All →</button>
        </div>
        {loading ? <SkeletonGrid count={3} /> : (
          <div className="scroll-x">
            {upcoming.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>

      {/* Why CineRush */}
      <div className="section">
        <div className="grid-4" style={{ textAlign: 'center' }}>
          {[
            { icon: '🎭', title: 'All Genres', desc: 'Action, Drama, Comedy, Horror & more' },
            { icon: '💺', title: 'Easy Seat Selection', desc: 'Pick your perfect seat instantly' },
            { icon: '💳', title: 'Secure Payment', desc: 'UPI, Cards & Net Banking supported' },
            { icon: '📱', title: 'E-Tickets', desc: 'QR code tickets on your phone' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</div>
              <div className="text-muted text-sm">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>CINE<span style={{ color: 'var(--gold)' }}>RUSH</span></div>
        <p>© 2024 CineRush. Book smarter. Watch better.</p>
      </footer>
    </div>
  );
}
