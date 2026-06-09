import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    setTimeout(() => {
      if (email === 'admin@cinerush.com' && password === 'admin123') {
        login({ name: 'Admin', email, role: 'admin' });
        navigate('/admin');
      } else if (email && password.length >= 6) {
        login({ name: email.split('@')[0], email, role: 'user' });
        navigate('/');
      } else {
        setError('Invalid email or password (min 6 chars)');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-5">
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.25rem' }}>CINE<span style={{ color: 'var(--gold)' }}>RUSH</span></div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem' }}>Welcome Back</h2>
          <p className="text-muted text-sm">Sign in to continue booking</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center gap-2 text-sm text-muted" style={{ cursor: 'pointer' }}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-accent">Forgot password?</Link>
          </div>
          {error && <div style={{ color: 'var(--accent)', background: 'rgba(230,57,70,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔓 Sign In'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.5rem 0' }} />
        <div className="text-center text-sm text-muted">
          Demo: any email + 6+ char password<br />Admin: admin@cinerush.com / admin123
        </div>
        <div className="divider" style={{ margin: '1.5rem 0' }} />
        <div className="text-center text-sm">
          Don't have an account? <Link to="/register" className="text-accent font-bold">Register →</Link>
        </div>
      </div>
    </div>
  );
}
