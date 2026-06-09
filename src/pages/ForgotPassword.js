import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{sent ? '📧' : '🔑'}</div>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '0.5rem' }}>{sent ? 'Check Your Email' : 'Forgot Password'}</h2>
        {sent ? (
          <>
            <p className="text-muted mb-4">We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn btn-primary">← Back to Login</Link>
          </>
        ) : (
          <>
            <p className="text-muted text-sm mb-4">Enter your email and we'll send you a reset link</p>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => { if (email) setSent(true); }}>Send Reset Link</button>
            <div className="mt-3 text-sm"><Link to="/login" className="text-muted">← Back to Login</Link></div>
          </>
        )}
      </div>
    </div>
  );
}
