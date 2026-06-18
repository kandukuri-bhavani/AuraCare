import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI } from '../services/api';
import { Stethoscope, LogOut, User as UserIcon, Calendar, Bell, ShieldAlert, Clock, Video } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [upcomingCall, setUpcomingCall] = useState(null);
  const [minsRemaining, setMinsRemaining] = useState(0);

  useEffect(() => {
    if (!user || (user.role !== 'patient' && user.role !== 'doctor')) {
      setUpcomingCall(null);
      return;
    }

    const checkAppointments = async () => {
      try {
        let res;
        if (user.role === 'patient') {
          res = await appointmentAPI.getPatientAppointments();
        } else {
          res = await appointmentAPI.getDoctorAppointments();
        }

        const confirmedCalls = res.data?.filter(
          a => a.consultationType === 'video' && a.status === 'confirmed'
        ) || [];

        const now = new Date();
        let activeCall = null;
        let minDiff = 999;

        confirmedCalls.forEach(appt => {
          if (!appt.date || !appt.timeSlot) return;
          
          const apptDate = new Date(appt.date);
          const timeSlot = appt.timeSlot;
          const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            let [_, hours, minutes, amp] = match;
            hours = parseInt(hours);
            minutes = parseInt(minutes);
            if (amp.toUpperCase() === 'PM' && hours < 12) hours += 12;
            if (amp.toUpperCase() === 'AM' && hours === 12) hours = 0;
            apptDate.setHours(hours, minutes, 0, 0);
          }

          const diffMs = apptDate.getTime() - now.getTime();
          const diffMins = Math.round(diffMs / (60 * 1000));

          // Active if call is starting in next 15 mins OR is currently ongoing (within 45 mins after start)
          if (diffMins >= -45 && diffMins <= 15) {
            if (Math.abs(diffMins) < Math.abs(minDiff)) {
              minDiff = diffMins;
              activeCall = appt;
            }
          }
        });

        if (activeCall) {
          setUpcomingCall(activeCall);
          setMinsRemaining(minDiff);
        } else {
          setUpcomingCall(null);
        }
      } catch (err) {
        console.error('Failed to check upcoming consultations:', err);
      }
    };

    checkAppointments();
    const interval = setInterval(checkAppointments, 20000); // Check every 20 seconds
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'patient') return '/dashboard/patient';
    if (user.role === 'doctor') return '/dashboard/doctor';
    if (user.role === 'hospital') return '/dashboard/hospital';
    return '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 text-clinic-700 hover:text-clinic-800 transition-colors">
                <div className="bg-clinic-50 p-2 rounded-xl border border-clinic-100">
                  <Stethoscope className="h-6 w-6 text-clinic-600" />
                </div>
                <span className="font-sans font-extrabold text-xl tracking-tight text-slate-800">
                  Aura<span className="text-clinic-600">Care</span>
                </span>
              </Link>
  
              {/* General Navigation Links */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/hospitals" className="text-slate-600 hover:text-clinic-700 text-sm font-medium transition-colors">
                  Find Hospitals
                </Link>
                <Link to="/smart-recommendation" className="text-slate-600 hover:text-clinic-700 text-sm font-medium transition-colors flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clinic-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-clinic-500"></span>
                  </span>
                  Smart Matcher
                </Link>
                <Link to="/emergency" className="text-emergency-600 hover:text-emergency-700 text-sm font-semibold transition-colors flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  Emergency Help
                </Link>
              </div>
            </div>
  
            {/* Right Action Panel */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={getDashboardPath()}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-clinic-600" />
                    Dashboard ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-emergency-600 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-700 hover:text-clinic-700 text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2.5 bg-clinic-700 hover:bg-clinic-800 text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-150"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {upcomingCall && (
        <div className="sticky top-16 z-40 bg-slate-900 border-b border-rose-500/20 text-slate-100 py-3 px-6 text-xs font-semibold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-fade-in text-left">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <Video className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            <span>
              <strong className="text-white">Upcoming Video Consultation:</strong> Your appointment with{' '}
              <span className="text-rose-300 font-extrabold">
                {user?.role === 'patient'
                  ? upcomingCall.doctorId?.name || 'Specialist Doctor'
                  : upcomingCall.patientId?.name || 'Patient'}
              </span>{' '}
              {minsRemaining > 0
                ? `starts in ${minsRemaining} minutes (${upcomingCall.timeSlot})`
                : `is active now! (${upcomingCall.timeSlot})`}
            </span>
          </div>
          <Link
            to={`/video-call/${upcomingCall._id}`}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md shadow-rose-950/20 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>📹</span>
            <span>Join Video Consultation</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
