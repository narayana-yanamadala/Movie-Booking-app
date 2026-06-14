import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from "../config";

const PAYMENT_OPTIONS = [
  { id: 'upi', icon: '📲', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'credit', icon: '💳', label: 'Credit Card', desc: 'Visa, MasterCard, Rupay' },
  { id: 'debit', icon: '🏧', label: 'Debit Card', desc: 'All major banks' },
  { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: 'SBI, HDFC, ICICI, Axis & more' },
];

export default function Payment() {
  const { cart } = useApp();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState('upi');
  const [upi, setUpi] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!cart) return (
    <div className="page text-center" style={{ padding: '4rem' }}>
      <div style={{ fontSize: '3rem' }}>🛒</div>
      <h2>No booking in progress</h2>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/movies')}>Browse Movies</button>
    </div>
  );

 const handlePay = async () => {
  try {
    setProcessing(true);

    const response = await fetch(
      `${API_URL}/api/book-ticket/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          movie_id: cart.movie.id,
          theater: cart.theater.name,
          show_date: "2026-06-12",
          show_time: cart.time,
          seats: cart.seats,
          amount: grand
        })
      }
    );

    const data = await response.json();

    console.log("BOOKING RESPONSE:", data);

    setProcessing(false);

    navigate("/otp-verify");

  } catch (error) {
    console.log(error);
    setProcessing(false);
  }
};

  const convenience = Math.round(cart.totalPrice * 0.05);
  const gst = Math.round((cart.totalPrice + convenience) * 0.18);
  const grand = cart.totalPrice + convenience + gst;

  return (
    <div className="page">
      <div className="section">
        <div className="steps">
          {[['🎭', 'Movie'], ['💺', 'Seats'], ['💳', 'Payment'], ['✅', 'Done']].map(([icon, label], i) => (
            <React.Fragment key={label}>
              <div className="step">
                <div className={`step-circle ${i < 2 ? 'done' : i === 2 ? 'active' : 'pending'}`}>{i < 2 ? '✓' : icon}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < 3 && <div className={`step-line ${i < 2 ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <h2 className="section-title mb-5">💳 Payment</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Payment Methods */}
          <div>
            <div className="card mb-4">
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Bebas Neue', fontSize: '1.3rem' }}>Select Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PAYMENT_OPTIONS.map(opt => (
                  <div
                    key={opt.id}
                    className={`payment-option ${payMethod === opt.id ? 'selected' : ''}`}
                    onClick={() => setPayMethod(opt.id)}
                  >
                    <div className="payment-icon">{opt.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      <div className="text-muted text-sm">{opt.desc}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${payMethod === opt.id ? 'var(--accent)' : 'var(--border)'}`, background: payMethod === opt.id ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {payMethod === opt.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic form */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Bebas Neue', fontSize: '1.3rem' }}>Payment Details</h3>
              {payMethod === 'upi' && (
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input className="form-input" placeholder="yourname@paytm / @gpay" value={upi} onChange={e => setUpi(e.target.value)} />
                  <div className="text-xs text-muted mt-1">Eg: 9876543210@paytm</div>
                </div>
              )}
              {(payMethod === 'credit' || payMethod === 'debit') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNo} onChange={e => setCardNo(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-input" placeholder="MM/YY" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" placeholder="•••" maxLength={3} type="password" value={cvv} onChange={e => setCvv(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name on Card</label>
                    <input className="form-input" placeholder="Your Full Name" />
                  </div>
                </>
              )}
              {payMethod === 'netbanking' && (
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-input" value={bank} onChange={e => setBank(e.target.value)}>
                    <option value="">Choose your bank</option>
                    {['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="card mb-3">
              <h3 style={{ marginBottom: '1rem', fontFamily: 'Bebas Neue', fontSize: '1.3rem' }}>Booking Summary</h3>
              <div className="flex gap-3 mb-3">
                <img src={cart.movie?.poster} alt={cart.movie?.title} style={{ width: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700 }}>{cart.movie?.title}</div>
                  <div className="text-muted text-sm">{cart.theater?.name}</div>
                  <div className="text-muted text-sm">🕐 {cart.time}</div>
                </div>
              </div>
              <div className="divider" />
              <div className="ticket-row"><span className="text-muted">Seats</span><span>{cart.seats?.join(', ')}</span></div>
              <div className="ticket-row"><span className="text-muted">Ticket Price</span><span>₹{cart.totalPrice}</span></div>
              <div className="ticket-row"><span className="text-muted">Convenience Fee</span><span>₹{convenience}</span></div>
              <div className="ticket-row"><span className="text-muted">GST (18%)</span><span>₹{gst}</span></div>
              <div className="divider" />
              <div className="flex justify-between font-bold" style={{ fontSize: '1.2rem' }}>
                <span>Total</span>
                <span className="text-accent">₹{grand}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-block btn-lg" onClick={handlePay} disabled={processing}>
              {processing ? '⏳ Processing...' : `🔒 Pay ₹${grand}`}
            </button>
            <div className="text-center text-xs text-muted mt-2">🔐 Secured by 256-bit SSL encryption</div>
          </div>
        </div>
      </div>
    </div>
  );
}
