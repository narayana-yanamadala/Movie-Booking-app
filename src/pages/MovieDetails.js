import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movies, theaters } from '../data/movies';
import { useApp } from '../context/AppContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const movie = movies.find(m => m.id === parseInt(id));
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  if (!movie) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🎭</div>
      <h2>Movie not found</h2>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  );

  const handleBooking = () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedTheater || !selectedTime) { alert('Please select a theater and showtime'); return; }
    navigate(`/seats/${movie.id}`, { state: { theater: selectedTheater, time: selectedTime, movie } });
  };

  return (
    <div className="page">
      {/* Banner */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img src={movie.banner} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }} />
      </div>

      <div className="section" style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Poster */}
          <div style={{ marginTop: '-120px', position: 'relative', zIndex: 2 }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', borderRadius: '14px', border: '3px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
            <button className="btn btn-primary btn-block mt-3 btn-lg" onClick={handleBooking}>
              🎬 Book Tickets
            </button>
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-2">
              {movie.trending && <span className="badge badge-accent">🔥 Trending</span>}
              {movie.upcoming && <span className="badge badge-muted">🗓 Upcoming</span>}
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>{movie.title}</h1>
            <div className="flex gap-3 items-center mb-4" style={{ flexWrap: 'wrap' }}>
              <span className="text-gold font-bold">⭐ {movie.rating}/10</span>
              <span className="chip">🕐 {movie.duration}</span>
              <span className="chip">🌐 {movie.language}</span>
              <span className="chip">📅 {new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {movie.genre.map(g => <span key={g} className="badge badge-accent">{g}</span>)}
            </div>

            <div className="card mb-4">
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Synopsis</h3>
              <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>{movie.description}</p>
            </div>

            <div className="card mb-4">
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cast</h3>
              <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                {movie.cast.map(c => (
                  <div key={c} style={{ textAlign: 'center' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 0.3rem', border: '2px solid var(--border)' }}>👤</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '70px' }}>{c}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trailer */}
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trailer</h3>
              <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'var(--surface2)', padding: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => window.open('https://youtube.com', '_blank')}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>▶️</div>
                <div className="text-muted text-sm">Watch Official Trailer</div>
              </div>
            </div>
          </div>
        </div>

        {/* Theater Selection */}
        {!movie.upcoming && (
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
                    <div className="text-sm text-muted">
                      From ₹{t.price.standard}
                    </div>
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
