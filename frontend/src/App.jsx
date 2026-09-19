import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Student Pages
import StudentDashboard from './pages/StudentDashboard.jsx';
import AddActivity from './pages/AddActivity.jsx';
import MyActivities from './pages/MyActivities.jsx';
import ActivityDetails from './pages/ActivityDetails.jsx';
import EditActivity from './pages/EditActivity.jsx';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AllActivities from './pages/AllActivities.jsx';
import VerifyActivities from './pages/VerifyActivities.jsx';
import AdminReports from './pages/AdminReports.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Accessible to students (and admin preview) */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/activities/new" element={<AddActivity />} />
          <Route path="/student/activities" element={<MyActivities />} />
          <Route path="/student/activities/:id" element={<ActivityDetails />} />
          <Route path="/student/activities/edit/:id" element={<EditActivity />} />
          <Route
            path="/student/approved"
            element={<AllActivities approvedOnly={true} />}
          />
        </Route>

        {/* Protected Admin Routes (Requires role: admin) */}
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/activities" element={<AllActivities />} />
          <Route path="/admin/verification" element={<VerifyActivities />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
