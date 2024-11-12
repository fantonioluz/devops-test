import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReservasPage from './pages/ReservasPage';
import SalasPage from './pages/SalasPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reservas" element={<ProtectedRoute><ReservasPage /></ProtectedRoute>} />
        <Route path="/salas" element={<ProtectedRoute><SalasPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
