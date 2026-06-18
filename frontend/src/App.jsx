import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import HospitalSearch from './pages/HospitalSearch';
import HospitalDetails from './pages/HospitalDetails';
import SmartRecommendation from './pages/SmartRecommendation';
import EmergencyHelp from './pages/EmergencyHelp';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import VideoCall from './pages/VideoCall';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
          {/* Main navigation header */}
          <Navbar />
          
          {/* Main content body */}
          <main className="flex-1">
            <Routes>
              {/* Protected Clinical Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hospitals" 
                element={
                  <ProtectedRoute>
                    <HospitalSearch />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hospitals/:id" 
                element={
                  <ProtectedRoute>
                    <HospitalDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/smart-recommendation" 
                element={
                  <ProtectedRoute>
                    <SmartRecommendation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/emergency" 
                element={
                  <ProtectedRoute>
                    <EmergencyHelp />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video-call/:id" 
                element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                } 
              />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Role Dashboards */}
              <Route 
                path="/dashboard/patient" 
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/doctor" 
                element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/hospital" 
                element={
                  <ProtectedRoute allowedRoles={['hospital']}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route redirecting back to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer branding */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
