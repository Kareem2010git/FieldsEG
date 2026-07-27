import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// استيراد مسارات الموقع الأساسية
import Landing from './pages/Landing';
import Login from './pages/Login';
import Fields from './pages/Fields';
import Bookings from './pages/Bookings';
import SignUp from './pages/SignUp';
import UploadReceipt from './pages/UploadReceipt';

// استيراد مسارات الأدمن ولوحة التحكم
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* مسارات الموقع الأساسية */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/book/:fieldId" element={<Bookings />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/upload-receipt" element={<UploadReceipt />} />

        {/* مسارات لوحة التحكم والأدمن */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}