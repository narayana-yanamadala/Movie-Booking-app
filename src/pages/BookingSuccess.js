import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeCanvas as QRCode } from "qrcode.react";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const booking = state?.booking;
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (!booking) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  const qrData = JSON.stringify({ id: booking.id, movie: booking.movieTitle, seats: booking.seats?.join(','), theater: booking.theater, time: booking.time });

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {/* Success animation */}
        <div className={`success-icon`} style={{ fontSize: '5rem', marginBottom: '1rem', display: 'block', opacity: show ? 1 : 0, transition: 'opacity 0.3s' }}>🎉</div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '3rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
        <p className="text-muted mb-5">Your tickets have been booked. Enjoy the movie!</p>

        {/* Ticket */}
        <div className="ticket mb-4">
          <div className="ticket-header">
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: '2px', color: '#fff' }}>CINE<span style={{ color: '#ffd700' }}>RUSH</span></div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>E-Ticket</div>
          </div>
          <div className="ticket-body">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
             <QRCode
             value={qrData}
              size={120}
              />  
            </div>
            <div className="ticket-row"><span className="text-muted">Booking ID</span><span className="text-accent font-bold">{booking.id}</span></div>
            <div className="ticket-row"><span className="text-muted">Movie</span><span className="font-bold">{booking.movieTitle}</span></div>
            <div className="ticket-row"><span className="text-muted">Theater</span><span style={{ fontSize: '0.85rem', textAlign: 'right', maxWidth: '200px' }}>{booking.theater}</span></div>
            <div className="ticket-row"><span className="text-muted">Date</span><span>{new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
            <div className="ticket-row"><span className="text-muted">Time</span><span>{booking.time}</span></div>
            <div className="ticket-row"><span className="text-muted">Seats</span><span className="text-success font-bold">{booking.seats?.join(', ')}</span></div>
            <div className="ticket-row"><span className="text-muted">Amount Paid</span><span className="text-accent font-bold">₹{booking.totalPrice}</span></div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button className="btn btn-primary btn-lg" onClick={() => window.print()}>
            ⬇ Download Ticket
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/my-bookings')}>
            📋 My Bookings
          </button>
        </div>
        <button className="btn btn-outline mt-3 btn-block" onClick={() => navigate('/')}>🏠 Back to Home</button>
      </div>
    </div>
  );
}
