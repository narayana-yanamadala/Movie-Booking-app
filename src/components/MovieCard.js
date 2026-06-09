import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img className="movie-card-img" src={movie.poster} alt={movie.title} loading="lazy" />
      <div className="movie-card-overlay">
        <div style={{ color: '#fff', fontWeight: 700, textAlign: 'center', fontSize: '1rem' }}>{movie.title}</div>
        <button
          className="btn btn-primary btn-sm"
          onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
        >🎬 Book Now</button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.id}`); }}
        >ℹ️ Details</button>
      </div>
      <div className="movie-card-body">
        <div className="movie-card-title">{movie.title}</div>
        <div className="movie-card-meta">
          <span className="movie-card-rating">⭐ {movie.rating}</span>
          <span className="movie-card-lang">{movie.language}</span>
        </div>
        <div className="movie-card-genre">{movie.genre.join(' • ')}</div>
        <div className="flex justify-between items-center">
          <span className="movie-card-duration">🕐 {movie.duration}</span>
          {movie.trending && <span className="badge badge-accent">🔥 Trending</span>}
          {movie.upcoming && <span className="badge badge-muted">🗓 Upcoming</span>}
        </div>
      </div>
    </div>
  );
}
