import React, { createContext, useContext, useState, useEffect } from 'react';
import { bookings as dummyBookings } from '../data/movies';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [bookings, setBookings] = useState(() => {
    const b = localStorage.getItem('bookings');
    return b ? JSON.parse(b) : dummyBookings;
  });
  const [cart, setCart] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addBooking = (booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, login, logout, bookings, addBooking, cancelBooking, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
