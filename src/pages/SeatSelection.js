import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { movies } from '../data/movies';
import { useApp } from '../context/AppContext';

const COLS = 10;
const BOOKED = ['A3', 'A7', 'B5', 'C2', 'C8', 'D4', 'D9', 'E1', 'E6', 'F3', 'F8', 'G2', 'G7', 'H5'];

const SECTIONS = [
  { label: 'RECLINER', rows: ['A', 'B'], price: 450 },
  { label: 'PREMIUM', rows: ['C', 'D', 'E'], price: 280 },
  { label: 'STANDARD', rows: ['F', 'G', 'H'], price: 180 },
];

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setCart } = useApp();
  const { theater, time, movie: movieState } = location.state || {};
  const movie = movies.find(m => m.id === parseInt(id)) || movieState;
  const [selected, setSelected] = useState([]);

  const getSeatPrice = (row) => {
    const sec = SECTIONS.find(s => s.rows.includes(row));
    return sec?.price || 180;
  };

  const toggleSeat = (seatId, row) => {
    if (BOOKED.includes(seatId)) return;
    setSelected(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const totalPrice = selected.reduce((sum, s) => sum + getSeatPrice(s[0]), 0);

  const handleContinue = () => {
    if (selected.length === 0) return;
    setCart({ movie, theater, time, seats: selected, totalPrice });
    navigate('/payment');
  };

  if (!theater) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🎭</div>
      <h2>Please select a theater first</h2>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  );

  return (
    <div className="page">
      <div className="section">
        {/* Progress */}
        <div className="steps">
          {[['🎭', 'Movie'], ['💺', 'Seats'], ['💳', 'Payment'], ['✅', 'Done']].map(([icon, label], i) => (
            <React.Fragment key={label}>
              <div className="step">
                <div className={`step-circle ${i === 0 ? 'done' : i === 1 ? 'active' : 'pending'}`}>{i < 1 ? '✓' : icon}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < 3 && <div className={`step-line ${i < 1 ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <h2 className="section-title mb-2">{movie?.title}</h2>
        <div className="flex gap-3 items-center mb-5 text-muted text-sm">
          <span>🏛 {theater?.name}</span>
          <span>🕐 {time}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          {/* Seat map */}
          <div>
            <div className="card">
              <div className="screen">SCREEN</div>

              {SECTIONS.map(section => (
                <div key={section.label} style={{ marginBottom: '1.5rem' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{section.label}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>₹{section.price}</span>
                  </div>
                  <div className="seat-layout">
                    {section.rows.map(row => (
                      <div key={row} className="seat-row">
                        <div className="seat-row-label">{row}</div>
                        {Array.from({ length: COLS }, (_, col) => {
                          const seatId = `${row}${col + 1}`;
                          const isBooked = BOOKED.includes(seatId);
                          const isSelected = selected.includes(seatId);
                          return (
                            <React.Fragment key={seatId}>
                              {col === 5 && <div className="seat-aisle" />}
                              <div
                                className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                                onClick={() => toggleSeat(seatId, row)}
                                title={isBooked ? 'Booked' : seatId}
                              >
                                {col + 1}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex gap-4 justify-center mt-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                {[['available', '🟢 Available'], ['selected', '🔵 Selected'], ['booked', '🔴 Booked']].map(([cls, label]) => (
                  <div key={cls} className="flex items-center gap-2 text-sm text-muted">
                    <div className={`seat ${cls}`} style={{ width: '20px', height: '18px', cursor: 'default' }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ position: 'sticky', top: '80px' }}>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'Bebas Neue', fontSize: '1.4rem' }}>Booking Summary</h3>
            <div className="ticket-row">
              <span className="text-muted">Movie</span>
              <span className="font-bold" style={{ maxWidth: '160px', textAlign: 'right' }}>{movie?.title}</span>
            </div>
            <div className="ticket-row">
              <span className="text-muted">Theater</span>
              <span style={{ maxWidth: '160px', textAlign: 'right', fontSize: '0.85rem' }}>{theater?.name}</span>
            </div>
            <div className="ticket-row">
              <span className="text-muted">Showtime</span>
              <span>{time}</span>
            </div>
            <div className="ticket-row">
              <span className="text-muted">Seats</span>
              <span>{selected.length > 0 ? selected.join(', ') : '—'}</span>
            </div>
            <div className="divider" />

            {SECTIONS.map(sec => {
              const secSeats = selected.filter(s => sec.rows.includes(s[0]));
              if (secSeats.length === 0) return null;
              return (
                <div key={sec.label} className="flex justify-between text-sm mb-2">
                  <span className="text-muted">{sec.label} × {secSeats.length}</span>
                  <span>₹{sec.price * secSeats.length}</span>
                </div>
              );
            })}
            <div className="flex justify-between font-bold mt-2" style={{ fontSize: '1.1rem' }}>
              <span>Total</span>
              <span className="text-accent">₹{totalPrice}</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg mt-4"
              disabled={selected.length === 0}
              onClick={handleContinue}
            >
              Continue to Payment →
            </button>
            <div className="text-center text-xs text-muted mt-2">{selected.length} seat(s) selected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
