import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { movies, theaters } from '../data/movies';

const NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'movies', icon: '🎬', label: 'Manage Movies' },
  { id: 'theaters', icon: '🏛', label: 'Manage Theaters' },
  { id: 'bookings', icon: '📋', label: 'Manage Bookings' },
  { id: 'timings', icon: '🕐', label: 'Show Timings' },
];

function Dashboard() {
  const { bookings } = useApp();
  const stats = [
    { icon: '🎬', label: 'Total Movies', value: movies.length, color: '#e63946' },
    { icon: '🏛', label: 'Theaters', value: theaters.length, color: '#3498db' },
    { icon: '🎟', label: 'Bookings', value: bookings.length, color: '#2ecc71' },
    { icon: '💰', label: 'Revenue', value: '₹' + bookings.reduce((s, b) => s + (b.totalPrice || 0), 0).toLocaleString(), color: '#ffd700' },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '1.5rem' }}>Dashboard Analytics</h2>
      <div className="grid-4 mb-5">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', marginBottom: '1rem' }}>Recent Bookings</h3>
          <table className="table">
            <thead><tr><th>Movie</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id}>
                  <td style={{ fontSize: '0.85rem' }}>{b.movieTitle}</td>
                  <td>{b.seats?.join(', ')}</td>
                  <td className="text-accent">₹{b.totalPrice}</td>
                  <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-accent'}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', marginBottom: '1rem' }}>Top Movies</h3>
          {[...movies].sort((a, b) => b.rating - a.rating).slice(0, 5).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3 mb-3">
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: i === 0 ? '#000' : 'var(--text-muted)', flexShrink: 0 }}>{i + 1}</div>
              <img src={m.poster} alt={m.title} style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.title}</div>
                <div className="text-muted text-xs">⭐ {m.rating} · {m.language}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManageMovies() {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>Manage Movies</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Movie</button>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Poster</th><th>Title</th><th>Genre</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id}>
                <td><img src={m.poster} alt={m.title} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                <td style={{ fontWeight: 600 }}>{m.title}</td>
                <td className="text-muted text-sm">{m.genre[0]}</td>
                <td className="text-gold">⭐ {m.rating}</td>
                <td>{m.upcoming ? <span className="badge badge-muted">Upcoming</span> : <span className="badge badge-success">Active</span>}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" style={{ marginRight: '0.4rem' }}>✏️ Edit</button>
                  <button className="btn btn-sm" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent)' }}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAdd(false)}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', marginBottom: '1rem' }}>Add New Movie</h3>
            {['Title', 'Genre', 'Duration', 'Rating', 'Language', 'Release Date'].map(f => (
              <div key={f} className="form-group">
                <label className="form-label">{f}</label>
                <input className="form-input" placeholder={f} />
              </div>
            ))}
            <div className="flex gap-2">
              <button className="btn btn-primary">Add Movie</button>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageBookings() {
  const { bookings, cancelBooking } = useApp();
  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Bookings</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Movie</th><th>Theater</th><th>Date/Time</th><th>Seats</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="text-accent text-sm font-bold">{b.id}</td>
                <td style={{ fontWeight: 600, maxWidth: '140px' }}>{b.movieTitle}</td>
                <td className="text-muted text-sm" style={{ maxWidth: '140px' }}>{b.theater}</td>
                <td className="text-sm">{b.date} {b.time}</td>
                <td className="text-sm">{b.seats?.join(', ')}</td>
                <td className="text-accent font-bold">₹{b.totalPrice}</td>
                <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-accent'}`}>{b.status}</span></td>
                <td>{b.status === 'confirmed' && <button className="btn btn-sm" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent)' }} onClick={() => cancelBooking(b.id)}>Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageTheaters() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem' }}>Manage Theaters</h2>
        <button className="btn btn-primary">+ Add Theater</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {theaters.map(t => (
          <div key={t.id} className="card flex justify-between items-center">
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{t.name}</div>
              <div className="text-muted text-sm">📍 {t.location}</div>
              <div className="text-sm mt-1">Standard: ₹{t.price.standard} · Premium: ₹{t.price.premium} · Recliner: ₹{t.price.recliner}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm">✏️ Edit</button>
              <button className="btn btn-sm" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent)' }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageTimings() {
  return (
    <div>
      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '1.5rem' }}>Show Timings</h2>
      {theaters.map(t => (
        <div key={t.id} className="card mb-3">
          <div style={{ fontWeight: 700, marginBottom: '1rem' }}>{t.name}</div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {t.showTimings.map(time => (
              <div key={time} className="flex items-center gap-2" style={{ background: 'var(--surface2)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                <span className="text-sm">{time}</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
              </div>
            ))}
            <button className="btn btn-outline btn-sm">+ Add Timing</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const PANELS = { dashboard: Dashboard, movies: ManageMovies, theaters: ManageTheaters, bookings: ManageBookings, timings: ManageTimings };

export default function AdminDashboard() {
  const [active, setActive] = useState('dashboard');
  const Panel = PANELS[active];
  return (
    <div className="page flex">
      <aside className="admin-sidebar">
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: 'var(--accent)' }}>⚙️ ADMIN PANEL</div>
        {NAV.map(n => (
          <div key={n.id} className={`admin-nav-item ${active === n.id ? 'active' : ''}`} onClick={() => setActive(n.id)}>
            <span>{n.icon}</span><span>{n.label}</span>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Panel />
      </main>
    </div>
  );
}
