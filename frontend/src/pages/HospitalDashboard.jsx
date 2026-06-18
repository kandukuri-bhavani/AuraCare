import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hospitalAPI, doctorAPI, appointmentAPI } from '../services/api';
import { Building, Users, Calendar, Award, ShieldAlert, Loader2, Plus, Trash2, CheckCircle, Clock, MapPin, X, Settings } from 'lucide-react';

const HospitalDashboard = () => {
  const { user, profile, syncProfile } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state: 'details', 'doctors', 'bookings'
  const [activeTab, setActiveTab] = useState('bookings');

  // Edit hospital state
  const [hName, setHName] = useState(profile?.name || '');
  const [hCity, setHCity] = useState(profile?.city || '');
  const [hAddress, setHAddress] = useState(profile?.address || '');
  const [hMinPrice, setHMinPrice] = useState(profile?.minPrice || 200);
  const [hMaxPrice, setHMaxPrice] = useState(profile?.maxPrice || 800);
  const [hEmergency, setHEmergency] = useState(profile?.emergencyService ?? true);
  const [hIcu, setHIcu] = useState(profile?.icuAvailable ?? true);
  const [hBlood, setHBlood] = useState(profile?.bloodAvailable ?? true);
  const [hPhone, setHPhone] = useState(profile?.phone || '');
  const [hAmbulance, setHAmbulance] = useState(profile?.ambulanceContact || '');
  const [hDepts, setHDepts] = useState(profile?.departments?.join(', ') || '');
  const [hSchemes, setHSchemes] = useState(profile?.governmentSchemes?.join(', ') || '');
  const [detailsSaving, setDetailsSaving] = useState(false);

  // Create doctor states
  const [docUsername, setDocUsername] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docName, setDocName] = useState('');
  const [docSpecialization, setDocSpecialization] = useState('General Medicine');
  const [docExperience, setDocExperience] = useState('');
  const [docFee, setDocFee] = useState('');
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docLoading, setDocLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch bookings at this hospital
      const apptRes = await appointmentAPI.getHospitalAppointments();
      setAppointments(apptRes.data);

      // Fetch doctors at this hospital
      if (profile?._id) {
        const docRes = await doctorAPI.getAll({ hospitalId: profile._id });
        setDoctors(docRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch hospital dashboard details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  // Sync state when profile loads
  useEffect(() => {
    if (profile) {
      setHName(profile.name || '');
      setHCity(profile.city || '');
      setHAddress(profile.address || '');
      setHMinPrice(profile.minPrice || 200);
      setHMaxPrice(profile.maxPrice || 800);
      setHEmergency(profile.emergencyService ?? true);
      setHIcu(profile.icuAvailable ?? true);
      setHBlood(profile.bloodAvailable ?? true);
      setHPhone(profile.phone || '');
      setHAmbulance(profile.ambulanceContact || '');
      setHDepts(profile.departments?.join(', ') || '');
      setHSchemes(profile.governmentSchemes?.join(', ') || '');
    }
  }, [profile]);

  // Save hospital profile updates
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!hName || !hAddress || !hCity) {
      alert('Please fill in Name, Address, and City.');
      return;
    }

    try {
      setDetailsSaving(true);
      const deptsArray = hDepts.split(',').map(d => d.trim()).filter(d => d.length > 0);
      const schemesArray = hSchemes.split(',').map(s => s.trim()).filter(s => s.length > 0);

      const res = await hospitalAPI.update(profile._id, {
        name: hName,
        city: hCity,
        address: hAddress,
        minPrice: parseInt(hMinPrice),
        maxPrice: parseInt(hMaxPrice),
        emergencyService: hEmergency,
        icuAvailable: hIcu,
        bloodAvailable: hBlood,
        phone: hPhone,
        ambulanceContact: hAmbulance,
        departments: deptsArray,
        governmentSchemes: schemesArray
      });

      syncProfile(res.data);
      alert('Hospital clinical registry updated successfully!');
    } catch (err) {
      console.error('Failed to update hospital:', err);
      alert('Could not update registry details. Try again.');
    } finally {
      setDetailsSaving(false);
    }
  };

  // Add a new doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!docUsername || !docEmail || !docPassword || !docName) {
      alert('Please fill in all primary credential and name details.');
      return;
    }

    try {
      setDocLoading(true);
      const res = await doctorAPI.create({
        username: docUsername,
        email: docEmail,
        password: docPassword,
        name: docName,
        specialization: docSpecialization,
        experience: parseInt(docExperience),
        consultationFee: parseInt(docFee),
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
      });

      setDoctors([...doctors, res.data]);
      setDocModalOpen(false);
      setDocUsername('');
      setDocEmail('');
      setDocPassword('');
      setDocName('');
      alert(`Doctor account for ${docName} successfully created and linked to your hospital!`);
    } catch (err) {
      console.error('Failed to register doctor:', err);
      alert(err.response?.data?.message || 'Failed to create doctor account.');
    } finally {
      setDocLoading(false);
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the doctor profile for ${name}?`)) {
      return;
    }
    try {
      await doctorAPI.delete(id);
      setDoctors(doctors.filter(d => d._id !== id));
      alert(`Doctor profile for ${name} removed.`);
    } catch (err) {
      console.error('Failed to delete doctor:', err);
      alert('Could not delete doctor profile.');
    }
  };

  // Update Booking Status
  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(apptId, { status: newStatus });
      setAppointments(appointments.map(a => 
        a._id === apptId ? { ...a, status: newStatus } : a
      ));
      alert(`Appointment status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update booking status:', err);
      alert('Status change failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Loading hospital dashboard panel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Welcome banner header */}
      <div className="text-left mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hospital Administration</h1>
          <p className="text-slate-500 text-sm">Manage clinics, active doctor slots, and consult lists for <span className="font-bold text-slate-800">{profile?.name}</span>.</p>
        </div>

        {/* Tab buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'bookings' ? 'bg-white text-clinic-700 shadow-sm border border-slate-205/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Booked Patients ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'doctors' ? 'bg-white text-clinic-700 shadow-sm border border-slate-205/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Hospital Specialists ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'details' ? 'bg-white text-clinic-700 shadow-sm border border-slate-205/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Clinical Registry Settings
          </button>
        </div>
      </div>

      {/* TAB 1: Booking Management queue */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-6">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calendar className="h-5 w-5 text-clinic-600" />
            Hospital Reservation Queue
          </h2>

          {appointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm">No Active Booking Logs</p>
              <p className="text-xs">Once patients book slots at your hospital, they will appear in this administrative ledger.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt._id} className="p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-clinic-200 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-soft">
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-clinic-600 uppercase">
                      <span>Ref ID: {appt.appointmentId}</span>
                      <span className={`px-2 py-0.5 rounded font-black ${
                        appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        appt.status === 'completed' ? 'bg-clinic-50 text-clinic-700 border border-clinic-100' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Patient: {appt.patientId?.name || 'Verma Rohan'}</h4>
                      <p className="text-xs text-slate-400">Phone: {appt.patientId?.phone || 'N/A'} &bull; Age/Gender: {appt.patientId?.age || 30}/{appt.patientId?.gender || 'Male'}</p>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold">
                      Assigned Specialist: <span className="text-slate-800 font-bold">{appt.doctorId?.name || 'General Wards'}</span> ({appt.doctorId?.specialization || 'Medicine'})
                    </div>
                  </div>

                  {/* Date information & actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 border-t md:border-t-0 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-slate-400 block font-semibold">RESERVATION PASS</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-clinic-500" />
                        {new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} &bull; {appt.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {appt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-lg text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      {appt.status === 'completed' && (
                        <span className="text-xs font-extrabold text-clinic-700 bg-clinic-50 border border-clinic-100 px-3 py-1 rounded-lg">
                          Closed consultation
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Doctors affiliated list */}
      {activeTab === 'doctors' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-clinic-600" />
              Specialist Roster
            </h2>
            
            <button
              onClick={() => setDocModalOpen(true)}
              className="btn-primary py-2 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Register Specialist
            </button>
          </div>

          {doctors.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Users className="h-8 w-8 text-slate-300 mx-auto animate-pulse" />
              <p className="font-semibold text-sm">No Specialists Enrolled</p>
              <p className="text-xs">Add specialist doctors affiliated with your clinical departments to open active slots.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <div key={doc._id} className="p-5 border border-slate-100 bg-slate-50/50 hover:border-clinic-200 hover:bg-white rounded-2xl flex flex-col justify-between gap-4 transition-all hover:shadow-soft text-left">
                  
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="h-16 w-16 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                    />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{doc.name}</h4>
                      <p className="text-xs text-clinic-600 font-semibold">{doc.specialization}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Experience: {doc.experience} Years &bull; Rate: ₹{doc.consultationFee}</p>
                      <div className="text-amber-500 text-xs font-bold">★ {doc.rating || '5.0'} Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-150/60">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">
                      Consults: {doc.availableDays?.length || 0} active days
                    </div>
                    <button
                      onClick={() => handleDeleteDoctor(doc._id, doc.name)}
                      className="text-red-500 hover:text-red-700 p-1.5 bg-white hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
                      title="De-enroll Doctor"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Clinical Registry settings form */}
      {activeTab === 'details' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="h-5 w-5 text-clinic-600" />
            Clinical Registry settings
          </h2>

          <form onSubmit={handleSaveDetails} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Hospital Institution Name</label>
                <input
                  type="text"
                  required
                  value={hName}
                  onChange={(e) => setHName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Operating City</label>
                <input
                  type="text"
                  required
                  value={hCity}
                  onChange={(e) => setHCity(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Physical Address</label>
              <input
                type="text"
                required
                value={hAddress}
                onChange={(e) => setHAddress(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">General Contact Phone</label>
                <input
                  type="text"
                  value={hPhone}
                  onChange={(e) => setHPhone(e.target.value)}
                  placeholder="e.g. +91 22 2649 1048"
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">24/7 Ambulance Emergency Contact</label>
                <input
                  type="text"
                  value={hAmbulance}
                  onChange={(e) => setHAmbulance(e.target.value)}
                  placeholder="e.g. +91 9999 102 108"
                  className="input-field text-emerald-600 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Minimum Consulting Fee (₹)</label>
                <input
                  type="number"
                  value={hMinPrice}
                  onChange={(e) => setHMinPrice(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Maximum Consulting Fee (₹)</label>
                <input
                  type="number"
                  value={hMaxPrice}
                  onChange={(e) => setHMaxPrice(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Checkbox parameters */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Emergency Services & Critical Infrastructures</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hEmergency}
                    onChange={(e) => setHEmergency(e.target.checked)}
                    className="h-4 w-4 text-clinic-650 border-slate-300 rounded"
                  />
                  24/7 Trauma Emergency
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hIcu}
                    onChange={(e) => setHIcu(e.target.checked)}
                    className="h-4 w-4 text-clinic-650 border-slate-300 rounded"
                  />
                  ICU Wards Available
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hBlood}
                    onChange={(e) => setHBlood(e.target.checked)}
                    className="h-4 w-4 text-clinic-650 border-slate-300 rounded"
                  />
                  Blood Bank Storage
                </label>
              </div>
            </div>

            <div>
              <label className="input-label">Active Clinical Departments (Separated by commas)</label>
              <input
                type="text"
                value={hDepts}
                onChange={(e) => setHDepts(e.target.value)}
                placeholder="Cardiology, Pediatrics, General Medicine, Orthopedics"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Accepted Cashback / Government Schemes (Separated by commas)</label>
              <input
                type="text"
                value={hSchemes}
                onChange={(e) => setHSchemes(e.target.value)}
                placeholder="Ayushman Bharat PM-JAY, CGHS Card, State Low-Income Health Plan"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={detailsSaving}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-soft"
            >
              {detailsSaving ? 'Saving specifications...' : 'Save Registry Details'}
            </button>

          </form>
        </div>
      )}

      {/* Enrolls Doctor Modal overlay */}
      {docModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Enroll Medical Specialist</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Hospital Admin: {profile?.name}</p>
              </div>
              <button onClick={() => setDocModalOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              
              <div className="p-3 bg-clinic-50 border border-clinic-100 text-clinic-700 text-xs rounded-2xl font-semibold leading-relaxed">
                Add clinical credentials. The registered doctor can then sign in directly with their email and password to view patient queues.
              </div>

              {/* Doctor Name */}
              <div>
                <label className="input-label">Doctor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arvind Sharma"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Specialized department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="input-label">Medical Specialty</label>
                  <select
                    value={docSpecialization}
                    onChange={(e) => setDocSpecialization(e.target.value)}
                    className="input-field font-semibold"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology (Heart)</option>
                    <option value="Orthopedics">Orthopedics (Bones)</option>
                    <option value="Pediatrics">Pediatrics (Kids)</option>
                    <option value="Neurology">Neurology (Brain)</option>
                    <option value="Dermatology">Dermatology (Skin)</option>
                    <option value="Gynaecology">Gynaecology (Women)</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Exp (Yrs)</label>
                  <input
                    type="number"
                    required
                    value={docExperience}
                    onChange={(e) => setDocExperience(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Consultation fee */}
              <div>
                <label className="input-label">Consultation Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={docFee}
                  onChange={(e) => setDocFee(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Credentials details */}
              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Doctor Credentials Log</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="input-label text-[10px]">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="arvind_doc"
                      value={docUsername}
                      onChange={(e) => setDocUsername(e.target.value)}
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="input-label text-[10px]">Doctor Email</label>
                    <input
                      type="email"
                      required
                      placeholder="arvind@gmail.com"
                      value={docEmail}
                      onChange={(e) => setDocEmail(e.target.value)}
                      className="input-field text-xs py-2"
                    />
                  </div>
                  <div>
                    <label className="input-label text-[10px]">Login Password</label>
                    <input
                      type="password"
                      required
                      placeholder="doctor123"
                      value={docPassword}
                      onChange={(e) => setDocPassword(e.target.value)}
                      className="input-field text-xs py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDocModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={docLoading}
                  className="btn-primary text-xs"
                >
                  {docLoading ? 'Registering doctor...' : 'Create Doctor Account'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalDashboard;
