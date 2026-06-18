import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { appointmentAPI, healthRecordAPI, prescriptionAPI } from '../services/api';
import { Calendar, FileText, Pill, ShieldCheck, Plus, Award, Loader2, ArrowRight, ClipboardList, CreditCard, X } from 'lucide-react';
import { printPrescription } from '../utils/prescriptionPrinter';

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, records, prescriptions

  // Record Locker Upload States
  const [recordTitle, setRecordTitle] = useState('');
  const [recordType, setRecordType] = useState('report');
  const [recordNotes, setRecordNotes] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Selected Prescription Modal States
  const [activePrescription, setActivePrescription] = useState(null);

  // Selected Document View Modal States
  const [viewedDocument, setViewedDocument] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apptRes = await appointmentAPI.getPatientAppointments();
      setAppointments(apptRes.data);

      const recRes = await healthRecordAPI.getMyRecords();
      setRecords(recRes.data);

      const presRes = await prescriptionAPI.getMyPrescriptions();
      setPrescriptions(presRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUploadRecord = async (e) => {
    e.preventDefault();
    if (!recordTitle) {
      alert('Please enter a record title.');
      return;
    }

    try {
      setUploadLoading(true);
      const mockBase64 = 'data:application/pdf;base64,JVBERi0xLjQKJWM5cHJlY2lzaW9u...';
      const res = await healthRecordAPI.upload({
        title: recordTitle,
        type: recordType,
        notes: recordNotes,
        fileUrl: mockBase64
      });
      setRecords([res.data, ...records]);
      setRecordTitle('');
      setRecordNotes('');
      alert('Medical record added to secure clinical locker!');
    } catch (err) {
      console.error('Locker upload failed:', err);
      alert('Failed to upload file. Verify host connection.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenPrescription = (pres) => {
    setActivePrescription(pres);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Synchronizing medical records locker...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Header welcome */}
      <div className="text-left mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Portal</h1>
          <p className="text-slate-500 text-sm">Welcome back, <span className="font-bold text-slate-800">{profile?.name || user?.username}</span>. Check appointments and medical locker files.</p>
        </div>

        {/* Government Scheme Status Indicator */}
        {profile?.governmentSchemesEligible?.length > 0 && (
          <div className="flex items-center gap-2 bg-clinic-50 border border-clinic-100 p-3 rounded-2xl">
            <Award className="h-5 w-5 text-clinic-700 shrink-0" />
            <div className="text-left text-xs">
              <span className="text-slate-400 block font-semibold">Active Benefits card</span>
              <span className="font-extrabold text-clinic-700">{profile.governmentSchemesEligible[0]}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column sidebar widgets (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Visual ABHA Health Card Mockup */}
          <div className="bg-gradient-to-br from-clinic-700 via-clinic-800 to-teal-900 text-white rounded-3xl p-6 shadow-premium relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-0.5">
                <span className="text-[9px] bg-white/20 text-white border border-white/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Ayushman Bharat
                </span>
                <h4 className="font-bold text-xs text-white/80">ABHA Health Card</h4>
              </div>
              <CreditCard className="h-6 w-6 text-white/60 shrink-0" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-white/50 block font-medium">HOLDER NAME</span>
                <span className="text-sm font-extrabold tracking-wide uppercase">{profile?.name || user?.username}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-white/50 block font-medium">GENDER / AGE</span>
                  <span className="text-xs font-bold">{profile?.gender || 'Male'} &bull; {profile?.age || 30} Yrs</span>
                </div>
                <div>
                  <span className="text-[9px] text-white/50 block font-medium">VERIFIED ID</span>
                  <span className="text-xs font-mono font-bold tracking-tight">
                    {profile?.abhaId || '91-2083-4859-1039'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[9px] text-white/40">
              <span>National Health Authority</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-clinic-400 shrink-0" />
                NHA Certified Pass
              </span>
            </div>
          </div>

          {/* Secure Medical upload locker widget */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-clinic-700" />
              Upload Medical Report
            </h3>
            
            <form onSubmit={handleUploadRecord} className="space-y-3">
              <div>
                <label className="input-label">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood Sugar, Lab Report May"
                  value={recordTitle}
                  onChange={(e) => setRecordTitle(e.target.value)}
                  className="input-field py-2 text-xs"
                />
              </div>

              <div>
                <label className="input-label">Category</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="input-field py-2 text-xs"
                >
                  <option value="report">Diagnostic / Lab Report</option>
                  <option value="prescription">Old Prescription Scan</option>
                  <option value="lab_result">Blood / Urine Test</option>
                  <option value="other">Other Clinical Document</option>
                </select>
              </div>

              <div>
                <label className="input-label">Remarks / Description</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Fasting sugar: 110mg/dL..."
                  value={recordNotes}
                  onChange={(e) => setRecordNotes(e.target.value)}
                  className="input-field py-2 text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uploadLoading}
                className="btn-primary w-full py-2 text-xs font-bold"
              >
                {uploadLoading ? 'Uploading locker...' : 'Save in Secure Locker'}
              </button>
            </form>
          </div>

        </div>

        {/* Right column tab controls and data (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Main navigation tabs */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all focus:outline-none ${
                activeTab === 'appointments'
                  ? 'border-clinic-600 text-clinic-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calendar className="h-4.5 w-4.5" />
              Bookings ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all focus:outline-none ${
                activeTab === 'records'
                  ? 'border-clinic-600 text-clinic-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className="h-4.5 w-4.5" />
              Health Locker ({records.length})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all focus:outline-none ${
                activeTab === 'prescriptions'
                  ? 'border-clinic-600 text-clinic-700'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Pill className="h-4.5 w-4.5" />
              Prescriptions ({prescriptions.length})
            </button>
          </div>

          {/* TAB 1: Appointments lists */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center space-y-3">
                  <ClipboardList className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700 text-sm">No Active Bookings</p>
                  <p className="text-xs text-slate-400">Search clinics, match schemes and schedule your consultation slots.</p>
                  <Link to="/hospitals" className="btn-primary inline-flex text-xs">Search Directory</Link>
                </div>
              ) : (
                appointments.map((appt) => (
                  <div key={appt._id} className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-soft transition-all">
                    
                    <div className="text-left space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-clinic-600 uppercase">
                        <span>{appt.appointmentId}</span>
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                          appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          appt.status === 'completed' ? 'bg-clinic-50 text-clinic-700 border border-clinic-100' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">
                          {appt.doctorId?.name || 'Specialist Doctor'}
                        </h4>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          appt.consultationType === 'video'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {appt.consultationType === 'video' ? '📹 Video' : '🏥 In-Person'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-normal">{appt.hospitalId?.name || 'General Wards'}</p>
                      
                      <div className="text-[11px] text-slate-500 font-medium">
                        Reason: <span className="text-slate-700 font-semibold">{appt.reason}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 pt-3 border-t sm:border-t-0 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[9px] text-slate-400 block font-semibold">SCHEDULED PASS</span>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(appt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} &bull; {appt.timeSlot}
                        </span>
                      </div>
                      
                      {appt.status === 'completed' && (
                        <button
                          onClick={() => {
                            const matchingPres = prescriptions.find(p => p.appointmentId.toString() === appt._id.toString());
                            if (matchingPres) handleOpenPrescription(matchingPres);
                            else alert('No prescription files logged for this appointment yet.');
                          }}
                          className="px-3.5 py-1.5 bg-clinic-50 text-clinic-700 hover:bg-clinic-700 hover:text-white rounded-lg text-xs font-bold transition-all"
                        >
                          View Prescription
                        </button>
                      )}

                      {appt.consultationType === 'video' && appt.status === 'confirmed' && (
                        <Link
                          to={`/video-call/${appt._id}`}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
                        >
                          <span>📹</span>
                          <span>Join Video Call</span>
                        </Link>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Secure records locker list */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              {records.length === 0 ? (
                <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center space-y-3">
                  <FileText className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="font-semibold text-slate-700 text-sm">Secure Locker is Empty</p>
                  <p className="text-xs text-slate-400">Save lab results, prescription files, and medical histories to present to doctors.</p>
                </div>
              ) : (
                records.map((rec) => (
                  <div key={rec._id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between hover:shadow-soft transition-all">
                    <div className="flex items-center gap-3.5 text-left">
                      <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-slate-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{rec.title}</h4>
                        <p className="text-[10px] text-clinic-600 font-semibold uppercase tracking-wider">{rec.type}</p>
                        <p className="text-[10px] text-slate-400">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString('en-IN')}</p>
                        {rec.notes && <p className="text-[11px] text-slate-500 italic mt-1">"{rec.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewedDocument(rec)}
                        className="px-3 py-1.5 bg-clinic-55 bg-clinic-50 hover:bg-clinic-700 hover:text-white border border-clinic-100 text-clinic-700 rounded-xl text-xs font-bold transition-all"
                      >
                        View Document
                      </button>
                      <a
                        href={rec.fileUrl}
                        download={`${rec.title}.pdf`}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        Download Pass
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Digital Prescription List */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="bg-white border border-slate-100 p-8 rounded-3xl text-center space-y-3">
                  <Pill className="h-8 w-8 text-slate-300 mx-auto animate-bounce" />
                  <p className="font-semibold text-slate-700 text-sm">No Digital Prescriptions Logged</p>
                  <p className="text-xs text-slate-400">Once doctors diagnose you, they will submit digital drug directives directly here.</p>
                </div>
              ) : (
                prescriptions.map((pres) => (
                  <div key={pres._id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between hover:shadow-soft transition-all">
                    
                    <div className="text-left space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                        <span>CONSULTATION LOG:</span>
                        <span className="text-clinic-600 font-extrabold">
                          {new Date(pres.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        {pres.doctorId?.name || 'Dr. Arvind Sharma'}
                      </h4>
                      <p className="text-[11px] text-clinic-600 font-semibold">{pres.doctorId?.specialization || 'Cardiology'}</p>
                      
                      <div className="text-[11px] text-slate-500 font-medium">
                        Advised medicines: <span className="text-slate-800 font-bold">{pres.medicines.length} Medicines logged</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPrescription(pres)}
                      className="px-4 py-2 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      Open Dosage Chart &rarr;
                    </button>

                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

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
                <h4 className="font-black text-slate-800 text-base">{activePrescription.doctorId?.name || 'Dr. Arvind Sharma'}</h4>
                <p className="text-xs text-clinic-600 font-semibold">{activePrescription.doctorId?.specialization || 'Cardiology Expert'}</p>
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
                    {activePrescription.medicines.map((med, idx) => (
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
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                    "{activePrescription.advice}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const appt = appointments.find(a => a._id.toString() === activePrescription.appointmentId.toString());
                    printPrescription(activePrescription, profile, activePrescription.doctorId, appt?.hospitalId);
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

      {/* Document Viewer Modal Overlay */}
      {viewedDocument && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative text-left animate-zoom">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <FileText className="h-5 w-5 text-clinic-400" />
                  Health Locker Document Viewer
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Secure Vault &bull; Verified ID: {profile?.abhaId || '91-2083-4859-1039'}
                </p>
              </div>
              <button onClick={() => setViewedDocument(null)} className="p-1 hover:bg-white/10 rounded-lg text-white/80">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Content Mockup */}
            <div className="p-6 space-y-6">
              <div className="border border-slate-200 p-5 rounded-2xl bg-slate-50/50 shadow-inner relative space-y-4">
                {/* Watermark/Stamp */}
                <div className="absolute top-4 right-4 rotate-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1 text-[10px] font-black uppercase rounded tracking-wider select-none">
                  NHA CERTIFIED PASS
                </div>

                <div className="border-b border-slate-200 pb-3">
                  <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{viewedDocument.title}</h4>
                  <span className="text-[9px] bg-clinic-50 border border-clinic-150 text-clinic-700 px-2 py-0.5 rounded font-black uppercase">
                    {viewedDocument.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">PATIENT NAME</span>
                    <span className="text-slate-700 uppercase">{profile?.name || user?.username}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">RECORD LOCKER ID</span>
                    <span className="text-slate-700 font-mono">{viewedDocument._id || 'rec_mock_' + Math.floor(1000 + Math.random() * 9000)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">UPLOAD DATE</span>
                    <span className="text-slate-700">{new Date(viewedDocument.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">DIGITAL BLOCKCHAIN SPEC</span>
                    <span className="text-emerald-600">SHA-256 SECURED V2</span>
                  </div>
                </div>

                {viewedDocument.notes && (
                  <div className="bg-white p-3 border border-slate-150 rounded-xl space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Remarks / Notes</span>
                    <p className="text-xs text-slate-650 italic leading-relaxed">
                      "{viewedDocument.notes}"
                    </p>
                  </div>
                )}

                {/* Simulated file layout */}
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white flex flex-col items-center justify-center gap-2 text-center text-slate-400 py-6">
                  <FileText className="h-8 w-8 text-slate-300 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">Digital Document Scan Active</p>
                    <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">Physical document verified by national clinical registry system under ABHA credentialing.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                <a
                  href={viewedDocument.fileUrl}
                  download={`${viewedDocument.title}.pdf`}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  Download Local File
                </a>
                <button
                  onClick={() => setViewedDocument(null)}
                  className="btn-primary text-xs"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientDashboard;
