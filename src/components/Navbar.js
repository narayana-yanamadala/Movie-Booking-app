import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const active = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/movies?search=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        CINE<span>RUSH</span>
      </div>
      <div className="nav-links">
        <button className={active('/')} onClick={() => navigate('/')}>Home</button>
        <button className={active('/movies')} onClick={() => navigate('/movies')}>Movies</button>
        {user && <button className={active('/my-bookings')} onClick={() => navigate('/my-bookings')}>My Bookings</button>}
        {user?.role === 'admin' && <button className={active('/admin')} onClick={() => navigate('/admin')}>Admin</button>}
        <form onSubmit={handleSearch} style={{ margin: '0 0.5rem' }}>
          <div className="search-bar" style={{ padding: '0.35rem 0.8rem' }}>
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search movies..."
              style={{ width: '160px' }}
            />
          </div>
        </form>
        <button
          onClick={toggleTheme}
          className="nav-link"
          title="Toggle theme"
          style={{ fontSize: '1.1rem' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <span className="nav-link" style={{ color: 'var(--text)' }}>👤 {user.name}</span>
            <button className="nav-link" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-link btn-accent" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, background: 'var(--surface)',
          borderBottom: '1px solid var(--border)', padding: '1rem', zIndex: 999,
          display: 'flex', flexDirection: 'column', gap: '0.5rem'
        }}>
          {['/', '/movies', '/my-bookings'].map(path => (
            <button key={path} className="nav-link" onClick={() => { navigate(path); setMenuOpen(false); }}>
              {path === '/' ? 'Home' : path.replace('/', '').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
          <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="nav-link">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
          {user
            ? <button className="nav-link" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            : <button className="nav-link btn-accent" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Login</button>}
        </div>
      )}
    </nav>
  );
}
