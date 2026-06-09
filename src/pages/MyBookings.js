import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QRCodeCanvas as QRCode } from "qrcode.react";

export default function MyBookings() {
  const { bookings, cancelBooking } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="page">
      <div className="section">
        <div className="section-header">
          <h1 className="section-title">My <span>Bookings</span></h1>
          <div className="flex gap-2">
            {['all', 'confirmed', 'cancelled'].map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
            <h3 style={{ marginBottom: '0.5rem' }}>No bookings yet</h3>
            <p className="text-muted mb-4">Book your first movie ticket now!</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/movies')}>Browse Movies</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(b => (
              <div key={b.id} className="card" style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.25rem', alignItems: 'center' }}>
                <img src={b.poster} alt={b.movieTitle} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>{b.movieTitle}</div>
                  <div className="text-muted text-sm mb-1">🏛 {b.theater}</div>
                  <div className="text-muted text-sm mb-1">
                    📅 {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} · 🕐 {b.time}
                  </div>
                  <div className="text-sm mb-2">💺 Seats: <strong>{b.seats?.join(', ')}</strong></div>
                  <div className="flex gap-2 items-center">
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-accent'}`}>
                      {b.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                    </span>
                    <span className="text-accent font-bold">₹{b.totalPrice}</span>
                    <span className="text-xs text-muted">#{b.id}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => setSelected(b)}>🎟 View Ticket</button>
                  {b.status === 'confirmed' && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}
                      onClick={() => { if (window.confirm('Cancel this booking?')) cancelBooking(b.id); }}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', width: '100%' }}>
            <div className="ticket">
              <div className="ticket-header">
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: '#fff' }}>CINE<span style={{ color: '#ffd700' }}>RUSH</span></div>
              </div>
              <div className="ticket-body">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <QRCode value={selected.id} size={100} bgColor="transparent" fgColor="var(--text)" />
                </div>
                <div className="ticket-row"><span className="text-muted">Booking ID</span><span className="text-accent font-bold">{selected.id}</span></div>
                <div className="ticket-row"><span className="text-muted">Movie</span><span className="font-bold">{selected.movieTitle}</span></div>
                <div className="ticket-row"><span className="text-muted">Theater</span><span style={{ fontSize: '0.82rem', textAlign: 'right' }}>{selected.theater}</span></div>
                <div className="ticket-row"><span className="text-muted">Date</span><span>{new Date(selected.date).toLocaleDateString('en-IN')}</span></div>
                <div className="ticket-row"><span className="text-muted">Time</span><span>{selected.time}</span></div>
                <div className="ticket-row"><span className="text-muted">Seats</span><span className="text-success font-bold">{selected.seats?.join(', ')}</span></div>
                <div className="ticket-row"><span className="text-muted">Total</span><span className="text-accent font-bold">₹{selected.totalPrice}</span></div>
              </div>
            </div>
            <button className="btn btn-ghost btn-block mt-3" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
