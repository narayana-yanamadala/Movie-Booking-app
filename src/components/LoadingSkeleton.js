import React from 'react';

export function MovieCardSkeleton() {
  return (
    <div className="movie-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3' }} />
      <div className="movie-card-body">
        <div className="skeleton" style={{ height: '16px', marginBottom: '8px', width: '80%' }} />
        <div className="skeleton" style={{ height: '12px', marginBottom: '6px', width: '60%' }} />
        <div className="skeleton" style={{ height: '12px', width: '40%' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, i) => <MovieCardSkeleton key={i} />)}
    </div>
  );
}
