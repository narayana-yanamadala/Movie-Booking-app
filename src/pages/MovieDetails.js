import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theaters } from '../data/movies';
import { useApp } from '../context/AppContext';
import axios from 'axios';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
  `https://cinerush-backend.onrender.com/api/movies/${id}/`
);
        setMovie(response.data);
      } catch (err) {
        console.error(err);
        setError('Movie not found');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleBooking = () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedTheater || !selectedTime) { alert('Please select a theater and showtime'); return; }
    navigate(`/seats/${movie.id}`, { state: { theater: selectedTheater, time: selectedTime, movie } });
  };

  if (loading) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🎬</div>
      <h2>Loading...</h2>
    </div>
  );

  if (error || !movie) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🎭</div>
      <h2>Movie not found</h2>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  );

  return (
    <div className="page">

      {/* Top Poster Banner */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden', background: 'var(--surface)' }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(6px) brightness(0.4)', transform: 'scale(1.05)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
      </div>

      <div className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* Poster */}
          <div style={{ marginTop: '-120px', position: 'relative', zIndex: 2 }}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: '100%', borderRadius: '14px', border: '3px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
            <button className="btn btn-primary btn-block mt-3 btn-lg" onClick={handleBooking}>
              🎬 Book Tickets
            </button>
          </div>

          {/* Info */}
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>
              {movie.title}
            </h1>

            <div className="flex gap-3 items-center mb-4" style={{ flexWrap: 'wrap' }}>
              <span className="text-gold font-bold">⭐ {movie.rating}/10</span>
              <span className="chip">🕐 {movie.duration}</span>
              <span className="chip">🌐 {movie.language}</span>
              <span className="badge badge-accent">{movie.genre}</span>
            </div>

            {/* Status */}
            <div className="card mb-4">
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </h3>
              <span className={`badge ${movie.is_active ? 'badge-accent' : 'badge-muted'}`}>
                {movie.is_active ? '✅ Now Showing' : '🔴 Not Available'}
              </span>
            </div>

            {/* Description — shows if available */}
            {movie.description && (
              <div className="card mb-4">
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Synopsis
                </h3>
                <p style={{ lineHeight: 1.8, color: 'var(--text)', margin: 0 }}>{movie.description}</p>
              </div>
            )}

            {/* Release Date — shows if available */}
            {movie.release_date && (
              <div className="card mb-4">
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Release Date
                </h3>
                <span className="chip">
                  📅 {new Date(movie.release_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}

            {/* Trailer — shows if available */}
            {movie.trailer_url && (
              <div className="card">
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Trailer
                </h3>
                <div
                  style={{ borderRadius: '10px', overflow: 'hidden', background: 'var(--surface2)', padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}
                  onClick={() => window.open(movie.trailer_url, '_blank')}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>▶️</div>
                  <div className="text-muted text-sm">Watch Official Trailer</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theater Selection — only show if movie is active */}
        {movie.is_active && (
          <div className="mt-5">
            <h2 className="section-title mb-4">🏛 Select <span>Theater</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {theaters.map(t => (
                <div
                  key={t.id}
                  className={`theater-card ${selectedTheater?.id === t.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedTheater(t); setSelectedTime(null); }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{t.name}</div>
                      <div className="text-muted text-sm">📍 {t.location}</div>
                    </div>
                    <div className="text-sm text-muted">From ₹{t.price.standard}</div>
                  </div>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    {t.showTimings.map(time => (
                      <button
                        key={time}
                        className={`time-chip ${selectedTime === time && selectedTheater?.id === t.id ? 'selected' : ''}`}
                        onClick={e => { e.stopPropagation(); setSelectedTheater(t); setSelectedTime(time); }}
                      >{time}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedTheater && selectedTime && (
              <div className="card mt-4" style={{ background: 'rgba(230,57,70,0.08)', borderColor: 'var(--accent)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{selectedTheater.name}</div>
                    <div className="text-muted text-sm">🕐 {selectedTime} · From ₹{selectedTheater.price.standard}</div>
                  </div>
                  <button className="btn btn-primary btn-lg" onClick={handleBooking}>
                    Select Seats →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}