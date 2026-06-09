import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import OTPVerify from './pages/OTPVerify';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';

import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/seats/:id" element={<ProtectedRoute><SeatSelection /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/otp-verify" element={<ProtectedRoute><OTPVerify /></ProtectedRoute>} />
          <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="page text-center" style={{ padding: '4rem' }}>
              <div style={{ fontSize: '5rem', fontFamily: 'Bebas Neue', color: 'var(--accent)' }}>404</div>
              <p className="text-muted mb-4">Page not found</p>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
