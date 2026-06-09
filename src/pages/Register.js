import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleRegister = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      login({ name: form.name, email: form.email, phone: form.phone, role: 'user' });
      navigate('/');
    }, 800);
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: 'calc(100vh - 64px)' }}>
      <div className="card" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="text-center mb-5">
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.25rem' }}>CINE<span style={{ color: 'var(--gold)' }}>RUSH</span></div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem' }}>Create Account</h2>
          <p className="text-muted text-sm">Join millions of movie lovers</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Your Name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
          </div>
          {error && <div style={{ color: 'var(--accent)', background: 'rgba(230,57,70,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>}
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
            {loading ? '⏳ Creating account...' : '🚀 Create Account'}
          </button>
        </form>
        <div className="divider" style={{ margin: '1.5rem 0' }} />
        <div className="text-center text-sm">Already have an account? <Link to="/login" className="text-accent font-bold">Sign In →</Link></div>
      </div>
    </div>
  );
}
