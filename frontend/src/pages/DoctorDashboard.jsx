import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { appointmentAPI, prescriptionAPI, healthRecordAPI, doctorAPI } from '../services/api';
import { ClipboardList, Stethoscope, Clock, FileText, Pill, CheckCircle, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { printPrescription } from '../utils/prescriptionPrinter';

const DoctorDashboard = () => {
  const { user, profile, syncProfile } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dashboard state tabs
  const [activeTab, setActiveTab] = useState('queue'); // queue, schedule

  // Prescription creation state
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [medsList, setMedsList] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('Once daily (After meal)');
  const [medDuration, setMedDuration] = useState('5 Days');
  const [advice, setAdvice] = useState('');
  const [prescribeLoading, setPrescribeLoading] = useState(false);

  // Patient Records locker review state
  const [reviewPatient, setReviewPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Schedule States
  const [selectedDays, setSelectedDays] = useState(profile?.availableDays || []);
  const [selectedSlots, setSelectedSlots] = useState(profile?.availableTimeSlots || []);
  const [scheduleSaving, setScheduleSaving] = useState(false);

  // Selected Prescription View Modal State
  const [activePrescription, setActivePrescription] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apptRes = await appointmentAPI.getDoctorAppointments();
      setAppointments(apptRes.data);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sync state if profile changes
  useEffect(() => {
    if (profile) {
      setSelectedDays(profile.availableDays || []);
      setSelectedSlots(profile.availableTimeSlots || []);
    }
  }, [profile]);

  // Review Locker Files
  const handleOpenReview = async (patient) => {
    try {
      setReviewPatient(patient);
      setRecordsLoading(true);
      setPatientRecords([]);
      const res = await healthRecordAPI.getPatientRecords(patient._id);
      setPatientRecords(res.data);
    } catch (err) {
      console.error('Failed to fetch patient records locker:', err);
    } finally {
      setRecordsLoading(false);
    }
  };

  // Add medicine to active scratch list
  const handleAddMedicine = () => {
    if (!medName || !medDosage) {
      alert('Please fill in Medicine Name and Dosage details.');
      return;
    }
    const newMed = {
      name: medName,
      dosage: medDosage,
      frequency: medFrequency,
      duration: medDuration
    };
    setMedsList([...medsList, newMed]);
    setMedName('');
    setMedDosage('');
  };

  const handleRemoveMedicine = (idx) => {
    const list = [...medsList];
    list.splice(idx, 1);
    setMedsList(list);
  };

  // Submit digital prescription
  const handlePrescribeSubmit = async (e) => {
    e.preventDefault();
    if (medsList.length === 0) {
      alert('Please add at least one medicine to the prescription.');
      return;
    }

    try {
      setPrescribeLoading(true);
      await prescriptionAPI.create({
        appointmentId: activeAppointment._id,
        patientId: activeAppointment.patientId._id,
        medicines: medsList,
        advice
      });

      // Update local appointments list status
      setAppointments(appointments.map(a => 
        a._id === activeAppointment._id ? { ...a, status: 'completed' } : a
      ));
      
      setActiveAppointment(null);
      setMedsList([]);
      setAdvice('');
      alert('Digital prescription saved! Appointment marked as completed.');
    } catch (err) {
      console.error('Prescription create failed:', err);
      alert('Failed to log prescription. Verify server status.');
    } finally {
      setPrescribeLoading(false);
    }
  };

  // Toggle Days
  const handleDayChange = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Toggle Slots
  const handleSlotChange = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  // Submit Schedule Updates
  const handleSaveSchedule = async () => {
    if (selectedDays.length === 0 || selectedSlots.length === 0) {
      alert('Please choose at least one active day and one time slot.');
      return;
    }

    try {
      setScheduleSaving(true);
      const res = await doctorAPI.update(profile._id, {
        availableDays: selectedDays,
        availableTimeSlots: selectedSlots
      });
      syncProfile(res.data);
      alert('Consulting schedule updated successfully in databases!');
    } catch (err) {
      console.error('Schedule update error:', err);
      alert('Failed to save schedule settings.');
    } finally {
      setScheduleSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Synchronizing clinic queue database...</span>
      </div>
    );
  }

  const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotsOptions = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Profile header banner */}
      <div className="text-left mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile?.photo}
            alt={profile?.name}
            className="h-16 w-16 rounded-full object-cover border border-slate-200 bg-slate-50 shrink-0"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile?.name}</h1>
            <p className="text-slate-500 text-sm">{profile?.specialization} &bull; Clinical Queue Portal</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'queue' ? 'bg-white text-clinic-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Today's Queue ({appointments?.filter(a => a.status === 'confirmed' || a.status === 'pending').length || 0})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'history' ? 'bg-white text-clinic-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Consulted Patients ({appointments?.filter(a => a.status === 'completed').length || 0})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'schedule' ? 'bg-white text-clinic-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Set Available Slots
          </button>
        </div>
      </div>

      {/* 2. TAB 1: Queue Listing */}
      {activeTab === 'queue' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-6">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ClipboardList className="h-5 w-5 text-clinic-600 shrink-0" />
            Patient Consulting Queue
          </h2>

          {(appointments?.filter(a => a.status === 'confirmed' || a.status === 'pending').length || 0) === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <ClipboardList className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm">No Appointments Scheduled</p>
              <p className="text-xs">Once patients book slots at your hospital, they will appear in this queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments?.filter(a => a.status === 'confirmed' || a.status === 'pending').map((appt) => (
                <div key={appt._id} className="p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-clinic-200 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-soft">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-clinic-600 uppercase">
                      <span>Ref: {appt.appointmentId}</span>
                      <span className={`px-2 py-0.5 rounded font-black ${
                        appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        appt.status === 'completed' ? 'bg-clinic-50 text-clinic-700 border border-clinic-100' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {appt.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-black ${
                        appt.consultationType === 'video'
                          ? 'bg-rose-50 text-rose-600 border border-rose-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {appt.consultationType === 'video' ? '📹 Video' : '🏥 In-Person'}
                      </span>
                    </div>

                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-sm">{appt.patientId?.name || 'Rohan Verma'}</h4>
                      <p className="text-xs text-slate-400">Age: {appt.patientId?.age || 32} &bull; Gender: {appt.patientId?.gender || 'Male'} &bull; Phone: {appt.patientId?.phone}</p>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Symptoms: <span className="text-slate-800 font-semibold">{appt.reason}</span>
                    </div>
                  </div>

                  {/* Scheduled indicators & actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 border-t md:border-t-0 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-slate-400 block font-semibold">SCHEDULED PASS</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-clinic-500" />
                        {new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} &bull; {appt.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {appt.consultationType === 'video' && appt.status === 'confirmed' && (
                        <Link
                          to={`/video-call/${appt._id}`}
                          className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all animate-pulse"
                        >
                          <span>📹 Launch Call</span>
                        </Link>
                      )}

                      <button
                        onClick={() => handleOpenReview(appt.patientId)}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <FileText className="h-4 w-4 text-clinic-500 shrink-0" />
                        Medical History
                      </button>

                      {(appt.status === 'confirmed' || appt.status === 'pending') && (
                        <button
                          onClick={() => {
                            setActiveAppointment(appt);
                            setMedsList([]);
                            setAdvice('');
                          }}
                          className="px-3.5 py-2 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                        >
                          <Pill className="h-4 w-4 shrink-0" />
                          Write Rx
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 1.5: Consulted History Listing */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-6">
          <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Stethoscope className="h-5 w-5 text-clinic-600 shrink-0" />
            Consultation History
          </h2>

          {(appointments?.filter(a => a.status === 'completed').length || 0) === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <ClipboardList className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-sm">No Consulted Patients</p>
              <p className="text-xs">After you finalize clinical prescriptions, patients will appear in this archive ledger.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments?.filter(a => a.status === 'completed').map((appt) => (
                <div key={appt._id} className="p-5 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-clinic-200 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:shadow-soft">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-clinic-600 uppercase">
                      <span>Ref ID: {appt.appointmentId}</span>
                      <span className="px-2 py-0.5 rounded font-black text-[9px] bg-clinic-50 text-clinic-700 border border-clinic-100">
                        {appt.status}
                      </span>
                    </div>

                    <div className="text-left">
                      <h4 className="font-extrabold text-slate-800 text-sm">{appt.patientId?.name || 'Rohan Verma'}</h4>
                      <p className="text-xs text-slate-400">Age: {appt.patientId?.age || 32} &bull; Gender: {appt.patientId?.gender || 'Male'} &bull; Phone: {appt.patientId?.phone}</p>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Symptoms: <span className="text-slate-700 font-bold">{appt.reason}</span>
                    </div>
                  </div>

                  {/* Scheduled indicators & actions */}
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 border-t md:border-t-0 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-slate-400 block font-semibold">CONSULT DATE</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-clinic-500" />
                        {new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; {appt.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReview(appt.patientId)}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <FileText className="h-4 w-4 text-clinic-500 shrink-0" />
                        Medical History
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            const res = await prescriptionAPI.getByAppointment(appt._id);
                            if (res.data) {
                              setActivePrescription(res.data);
                            } else {
                              alert('No prescription record found.');
                            }
                          } catch (err) {
                            console.error('Failed to load prescription:', err);
                            alert('No prescription charts logged for this completed consultation.');
                          }
                        }}
                        className="px-3 py-2 bg-clinic-50 hover:bg-clinic-700 hover:text-white border border-clinic-100 text-clinic-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Pill className="h-4 w-4 shrink-0 text-clinic-600 hover:text-inherit" />
                        View Written Rx
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB 2: Set Availability Slots */}
      {activeTab === 'schedule' && (
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft text-left space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="h-5 w-5 text-clinic-600 shrink-0" />
              Configure Consultation Schedules
            </h2>

            {/* Checkboxes Days */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">1. Active Consulting Days</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {daysOptions.map((day) => (
                  <label key={day} className={`p-3.5 border rounded-2xl flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                    selectedDays.includes(day)
                      ? 'border-clinic-500 bg-clinic-50/50 text-clinic-800 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="h-4 w-4 text-clinic-600 rounded border-slate-350"
                    />
                    {day.slice(0, 3)}
                  </label>
                ))}
              </div>
            </div>

            {/* Checkboxes Slots */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">2. Active Time Slots Wards</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slotsOptions.map((slot) => (
                  <label key={slot} className={`p-3.5 border rounded-2xl flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                    selectedSlots.includes(slot)
                      ? 'border-clinic-500 bg-clinic-50/50 text-clinic-800 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSlots.includes(slot)}
                      onChange={() => handleSlotChange(slot)}
                      className="h-4 w-4 text-clinic-600 rounded border-slate-350"
                    />
                    {slot}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSchedule}
              disabled={scheduleSaving}
              className="btn-primary px-6 py-3 font-bold text-sm flex items-center justify-center gap-1.5"
            >
              {scheduleSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Slot Configs...
                </>
              ) : (
                'Save Schedule Specifications'
              )}
            </button>

          </div>
        </div>
      )}

      {/* 4. Overlay Modal: Write Digital Prescription */}
      {activeAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Pill className="h-5 w-5 text-clinic-400" />
                  Prescription Writer (Rx)
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Patient: {activeAppointment.patientId?.name} &bull; Ref: {activeAppointment.appointmentId}
                </p>
              </div>
              <button onClick={() => { setActiveAppointment(null); setMedsList([]); }} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Medicine Add Subform */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <Plus className="h-4 w-4 text-clinic-600" />
                  Add Medicine
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-[10px]">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol, Atenolol"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className="input-field py-2 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="input-label text-[10px]">Dosage / Milligrams</label>
                    <input
                      type="text"
                      placeholder="e.g. 500mg, 25mg"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      className="input-field py-2 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="input-label text-[10px]">Frequency</label>
                    <select
                      value={medFrequency}
                      onChange={(e) => setMedFrequency(e.target.value)}
                      className="input-field py-2 text-xs bg-white font-semibold"
                    >
                      <option>Once daily (After meal)</option>
                      <option>Once daily (Morning Fasting)</option>
                      <option>Twice daily (After food)</option>
                      <option>Thrice daily (After food)</option>
                      <option>Once daily (Night)</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label text-[10px]">Duration</label>
                    <input
                      type="text"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      placeholder="e.g. 5 Days, 1 Month"
                      className="input-field py-2 text-xs bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-4 py-2 bg-clinic-50 border border-clinic-150 text-clinic-700 hover:bg-clinic-700 hover:text-white rounded-xl text-xs font-bold transition-all w-full flex items-center justify-center gap-1"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  Add Medicine to Chart
                </button>
              </div>

              {/* Medicines Chart Table (if meds added) */}
              {medsList.length > 0 ? (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-soft text-xs text-left">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-3 py-2.5">Dose</th>
                        <th className="px-3 py-2.5">Freq</th>
                        <th className="px-3 py-2.5">Days</th>
                        <th className="px-4 py-2.5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {medsList.map((med, idx) => (
                        <tr key={idx} className="bg-white font-medium">
                          <td className="px-4 py-2.5 font-bold text-slate-800">{med.name}</td>
                          <td className="px-3 py-2.5 text-slate-500">{med.dosage}</td>
                          <td className="px-3 py-2.5 text-clinic-700 font-bold">{med.frequency.slice(0, 10)}...</td>
                          <td className="px-3 py-2.5 text-slate-500">{med.duration}</td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              className="text-red-500 hover:text-red-700 shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center">No medicines added to Rx chart yet.</p>
              )}

              {/* Advice Input */}
              <div className="space-y-1.5">
                <label className="input-label">Clinical Advice / Lifestyle Notes</label>
                <textarea
                  rows="2"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Avoid spicy/oily foods. Light walking for 20 minutes. Drink plenty of water."
                  className="input-field text-xs py-2"
                ></textarea>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { setActiveAppointment(null); setMedsList([]); }}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handlePrescribeSubmit}
                disabled={prescribeLoading}
                className="btn-primary text-xs"
              >
                {prescribeLoading ? 'Saving Rx...' : 'Complete & Send Rx'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Overlay Modal: View Patient Medical History Locker */}
      {reviewPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom max-h-[85vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <FileText className="h-5 w-5 text-clinic-400 animate-pulse" />
                  Medical History Locker review
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Patient Name: {reviewPatient.name}</p>
              </div>
              <button onClick={() => setReviewPatient(null)} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {recordsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="h-6 w-6 text-clinic-600 animate-spin" />
                  <span className="text-slate-400 text-xs font-semibold">Reading medical indexes...</span>
                </div>
              ) : patientRecords.length === 0 ? (
                <div className="text-center py-10 text-slate-400 space-y-1">
                  <p className="font-semibold text-sm">Locker Vault is Empty</p>
                  <p className="text-[11px]">This patient has not uploaded any diagnostics reports to their portal.</p>
                </div>
              ) : (
                patientRecords.map((rec) => (
                  <div key={rec._id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{rec.title}</h4>
                      <span className="px-2 py-0.5 bg-clinic-50 border border-clinic-100 text-clinic-700 text-[8px] font-black uppercase rounded">
                        {rec.type}
                      </span>
                    </div>
                    {rec.notes && <p className="text-xs text-slate-500 leading-relaxed font-medium">"{rec.notes}"</p>}
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))
              )}

            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end shrink-0">
              <button
                onClick={() => setReviewPatient(null)}
                className="btn-primary text-xs"
              >
                Close History
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Selected Prescription Detail Sheet modal overlay */}
      {activePrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom">
            
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Pill className="h-5 w-5 text-clinic-400" />
                  Prescription Dosage Chart
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Generated on {new Date(activePrescription.date).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button onClick={() => setActivePrescription(null)} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6">
              
              {/* Doctor brand */}
              <div className="text-left">
                <h4 className="font-black text-slate-800 text-base">{profile?.name}</h4>
                <p className="text-xs text-clinic-600 font-semibold">{profile?.specialization}</p>
                <span className="text-[9px] text-slate-400 block font-bold uppercase mt-1">Book a Doctor Digitally Certified</span>
              </div>

              {/* Medicines Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-soft bg-slate-50/50">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Medicine Name</th>
                      <th className="px-3 py-3">Dosage</th>
                      <th className="px-3 py-3">Frequency</th>
                      <th className="px-4 py-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activePrescription.medicines?.map((med, idx) => (
                      <tr key={idx} className="bg-white hover:bg-slate-50 transition-colors font-medium">
                        <td className="px-4 py-3 font-bold text-slate-800">{med.name}</td>
                        <td className="px-3 py-3 text-slate-600">{med.dosage}</td>
                        <td className="px-3 py-3 text-clinic-700 font-semibold">{med.frequency}</td>
                        <td className="px-4 py-3 text-slate-500">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice */}
              {activePrescription.advice && (
                <div className="bg-clinic-50 border border-clinic-100 p-4 rounded-2xl text-left space-y-1.5">
                  <span className="text-[10px] text-clinic-700 font-black uppercase tracking-wider block">Clinical Advice / Notes</span>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold italic">
                    "{activePrescription.advice}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const appt = appointments.find(a => a._id.toString() === activePrescription.appointmentId.toString());
                    printPrescription(activePrescription, appt?.patientId, profile, appt?.hospitalId);
                  }}
                  className="px-4 py-2 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  Print Prescription (PDF)
                </button>
                <button
                  onClick={() => setActivePrescription(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Close Dosage Chart
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
