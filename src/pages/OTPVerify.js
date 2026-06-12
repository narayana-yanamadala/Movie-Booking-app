import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from 'axios';

export default function OTPVerify() {
  const navigate = useNavigate();
  const { cart, addBooking } = useApp();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [txnId, setTxnId] = useState('');
  const [tab, setTab] = useState('otp');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef([]);

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const sendOTP = async () => {

    if (!email) {
      setError("Please enter email");
      return;
    }

    try {

      setError("");

      const response = await axios.post(
        "https://cinerush-backend.onrender.com/api/send-otp/",
        {
          email: email
        }
      );

      console.log("SEND OTP RESPONSE:", response.data);
alert(JSON.stringify(response.data));

    } catch (error) {

      console.error(error);

      setError("Failed to send OTP");

    }
  };

  const handleVerify = async () => {

    const code = otp.join('');

    if (code.length < 6) {
      setError('Enter complete 6-digit OTP');
      return;
    }

    setVerifying(true);
    setError('');

    try {

      const response = await axios.post(
        "https://cinerush-backend.onrender.com/api/verify-otp/",
        {
          email: email,
          otp: code
        }
      );

      console.log("VERIFY RESPONSE:", response.data);
      alert(JSON.stringify(response.data));

      if (response.data.success) {

        const booking = {
          id: 'BK' + Date.now().toString().slice(-6),
          movieId: cart?.movie?.id,
          movieTitle: cart?.movie?.title,
          theater: cart?.theater?.name,
          date: new Date().toISOString().split('T')[0],
          time: cart?.time,
          seats: cart?.seats,
          totalPrice: cart?.totalPrice,
          status: 'confirmed',
          poster: cart?.movie?.poster,
        };

        addBooking(booking);

        navigate('/booking-success', {
          state: { booking }
        });

      } else {

        setError(response.data.message || "Invalid OTP");

      }

    } catch (error) {

      console.error(error);

      if (error.response) {
        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));
      }

      setError("OTP Verification Failed");

    } finally {

      setVerifying(false);

    }
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '0.5rem' }}>Verify Payment</h2>
        <p className="text-muted text-sm mb-4">Confirm your payment to complete the booking</p>

        <div className="flex gap-2 mb-5" style={{ justifyContent: 'center' }}>
          {[['otp', '📱 OTP'], ['txn', '🧾 Transaction ID']].map(([val, label]) => (
            <button key={val} className={`filter-chip ${tab === val ? 'active' : ''}`} onClick={() => setTab(val)}>{label}</button>
          ))}
        </div>

        {tab === 'otp' ? (
          <>
            <div className="form-group mb-3">
              <input
                className="form-input"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={sendOTP}
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              SEND OTP
            </button>

            <p className="text-sm text-muted mb-3">Enter the 6-digit OTP sent to your registered mobile</p>
            <div className="otp-input mb-4">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={el => refs.current[i] = el}
                  className="otp-box"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <p className="text-xs text-muted mb-4">Demo: Enter any 6 digits</p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted mb-3">Enter the Transaction ID from your payment confirmation</p>
            <div className="form-group">
              <input className="form-input" style={{ textAlign: 'center' }} placeholder="e.g. TXN123456789" value={txnId} onChange={e => setTxnId(e.target.value)} />
            </div>
            <p className="text-xs text-muted mb-4">Or upload your payment screenshot below</p>
            <div style={{ border: '2px dashed var(--border)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1rem', cursor: 'pointer' }} onClick={() => {}}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
              <div className="text-sm text-muted">Click to upload screenshot</div>
            </div>
          </>
        )}

        {error && <div style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}

        <button className="btn btn-primary btn-block btn-lg" onClick={handleVerify} disabled={verifying}>
          {verifying ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Verifying...
            </span>
          ) : '✅ Verify & Confirm Booking'}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}