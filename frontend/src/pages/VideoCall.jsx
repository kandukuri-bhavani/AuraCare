import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, prescriptionAPI, healthRecordAPI } from '../services/api';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, 
  FileText, Pill, Clock, Activity, ShieldAlert, 
  Loader2, Download, Plus, Trash2, Eye, RefreshCw, CheckCircle2,
  MessageSquare, Send
} from 'lucide-react';
import { printPrescription } from '../utils/prescriptionPrinter';

const VideoCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Call Session State
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Media controls state
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  // Tab State for Sidebar
  const [activeTab, setActiveTab] = useState('rx'); // 'rx', 'locker', or 'chat'

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Doctor Rx Form State
  const [medsList, setMedsList] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('Once daily (After meal)');
  const [medDuration, setMedDuration] = useState('5 Days');
  const [advice, setAdvice] = useState('');
  const [submitRxLoading, setSubmitRxLoading] = useState(false);

  // Health records locker state
  const [lockerRecords, setLockerRecords] = useState([]);
  const [lockerLoading, setLockerLoading] = useState(false);
  
  // Patient Live prescription checking
  const [livePrescription, setLivePrescription] = useState(null);
  const [checkRxLoading, setCheckRxLoading] = useState(false);

  // Record locker upload form for patients during call
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('report');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Initialize and fetch appointment
  const loadAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let res;
      if (user?.role === 'doctor') {
        res = await appointmentAPI.getDoctorAppointments();
      } else {
        res = await appointmentAPI.getPatientAppointments();
      }
      
      const appt = res.data.find(a => a._id === id);
      if (!appt) {
        setError('Appointment details not found.');
        return;
      }
      
      setAppointment(appt);

      // Fetch Patient Records locker for doctor
      if (user?.role === 'doctor' && appt.patientId?._id) {
        fetchPatientLocker(appt.patientId._id);
      } else if (user?.role === 'patient') {
        // Fetch patient's own records
        fetchPatientLocker();
        // Check if Rx already submitted
        checkLivePrescription(appt._id);
      }
    } catch (err) {
      console.error('Failed to init call:', err);
      setError('Workspace setup failed. Verify network connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientLocker = async (patientId) => {
    try {
      setLockerLoading(true);
      let res;
      if (patientId) {
        res = await healthRecordAPI.getPatientRecords(patientId);
      } else {
        res = await healthRecordAPI.getMyRecords();
      }
      setLockerRecords(res.data);
    } catch (err) {
      console.error('Locker fetch error:', err);
    } finally {
      setLockerLoading(false);
    }
  };

  const checkLivePrescription = async (apptId) => {
    try {
      setCheckRxLoading(true);
      const res = await prescriptionAPI.getByAppointment(apptId || id);
      if (res.data) {
        setLivePrescription(res.data);
      }
    } catch (err) {
      console.error('Failed checking prescription:', err);
    } finally {
      setCheckRxLoading(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    loadAppointmentDetails();
    
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  // Seed chat messages
  useEffect(() => {
    if (user) {
      setChatMessages([
        { sender: 'system', text: 'Secure end-to-end clinical channel active.', time: 'System' },
        { 
          sender: 'remote', 
          text: user.role === 'doctor' 
            ? 'Hello Doctor, I am online and joined the video workspace.' 
            : 'Hello, thank you for joining the consultation room. I am currently reviewing your records locker.', 
          time: '00:01' 
        }
      ]);
    }
  }, [user]);

  // Format Timer output
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Doctor prescription handlers
  const handleAddMedicine = () => {
    if (!medName || !medDosage) {
      alert('Please fill in Medicine Name and Dosage.');
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

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (medsList.length === 0) {
      alert('Please add at least one medicine to the prescription.');
      return;
    }

    try {
      setSubmitRxLoading(true);
      
      // 1. Submit prescription
      await prescriptionAPI.create({
        appointmentId: appointment._id,
        patientId: appointment.patientId._id,
        medicines: medsList,
        advice
      });

      // 2. Complete appointment
      await appointmentAPI.updateStatus(appointment._id, { status: 'completed' });

      alert('Digital prescription saved! Session finalized and closed.');
      navigate('/dashboard/doctor');
    } catch (err) {
      console.error('Rx Submit failure:', err);
      alert('Failed to save prescription.');
    } finally {
      setSubmitRxLoading(false);
    }
  };

  // Patient upload handler during call
  const handleUploadRecord = async (e) => {
    e.preventDefault();
    if (!uploadTitle) {
      alert('Please enter a record title.');
      return;
    }

    try {
      setUploadLoading(true);
      const mockBase64 = 'data:application/pdf;base64,JVBERi0xLjQKJWM5cHJlY2lzaW9u...';
      const res = await healthRecordAPI.upload({
        title: uploadTitle,
        type: uploadType,
        notes: uploadNotes,
        fileUrl: mockBase64
      });
      setLockerRecords([res.data, ...lockerRecords]);
      setUploadTitle('');
      setUploadNotes('');
      alert('Health report saved and shared instantly during call!');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload file.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEndCall = () => {
    const confirmLeave = window.confirm('Are you sure you want to exit the video call?');
    if (confirmLeave) {
      if (user?.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else {
        navigate('/dashboard/patient');
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: 'local',
      text: chatInput.trim(),
      time: formatTime(callTimer)
    };

    setChatMessages(prev => [...prev, userMsg]);
    const sentText = chatInput.trim().toLowerCase();
    setChatInput('');

    // Trigger mock responder after 1.5 seconds
    setTimeout(() => {
      let replyText = '';
      if (user?.role === 'doctor') {
        // Patient simulated replies
        if (sentText.includes('symptom') || sentText.includes('feel') || sentText.includes('happen') || sentText.includes('problem')) {
          replyText = 'Yes doctor, I have been experiencing some discomfort in my chest lately, especially when walking.';
        } else if (sentText.includes('medicine') || sentText.includes('pill') || sentText.includes('rx') || sentText.includes('presc')) {
          replyText = 'Understood. Will you write these down in my prescription? I can see the advice live.';
        } else if (sentText.includes('history') || sentText.includes('report') || sentText.includes('pdf') || sentText.includes('ecg')) {
          replyText = 'I have uploaded my latest ECG lab report PDF in my locker. You can view it under the Patient Medical Locker tab.';
        } else {
          replyText = 'Okay doctor, I understand. Please let me know what steps I should follow next.';
        }
      } else {
        // Doctor simulated replies
        if (sentText.includes('hello') || sentText.includes('hi')) {
          replyText = 'Hello. I am reviewing your case file. Please explain how you are feeling today.';
        } else if (sentText.includes('chest') || sentText.includes('pain') || sentText.includes('cough') || sentText.includes('fever')) {
          replyText = 'I see. I will write a digital prescription with Atenolol and Ecosprin. Please avoid heavy workloads and walk lightly.';
        } else if (sentText.includes('report') || sentText.includes('pdf') || sentText.includes('ecg') || sentText.includes('locker')) {
          replyText = 'Thank you for sharing the report. The ECG shows a slightly elevated heart rate, but nothing to worry about. Follow the Rx guidelines.';
        } else {
          replyText = 'I am updating your clinical records now. Make sure to download the Rx PDF once I finalize the session.';
        }
      }

      setChatMessages(prev => [...prev, {
        sender: 'remote',
        text: replyText,
        time: formatTime(callTimer)
      }]);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="h-10 w-10 text-rose-500 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold tracking-wide">Establishing encrypted clinical bridge...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-white p-6">
        <div className="bg-red-950/20 border border-red-500/30 p-8 rounded-3xl text-center space-y-4 max-w-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold">Workspace Unavailable</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{error || 'This consultation video bridge registry is not found.'}</p>
          <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const peerName = user?.role === 'doctor' ? appointment.patientId?.name : appointment.doctorId?.name;
  const peerTitle = user?.role === 'doctor' ? `Patient (ABHA ID: ${appointment.patientId?.abhaId || 'N/A'})` : `${appointment.doctorId?.specialization || 'Consultant'}`;
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      
      {/* 1. Header session bar */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-slate-800/60 px-6 py-3.5 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-150 flex items-center gap-1.5">
              AuraCare Telehealth Clinic
              <span className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 text-[9px] font-black text-rose-400 uppercase tracking-widest">
                LIVE SECURE
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Appt Ref: {appointment.appointmentId} &bull; Dept: {appointment.hospitalId?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-rose-400 bg-rose-950/30 border border-rose-900/30 px-3 py-1 rounded-xl text-xs font-mono font-bold">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(callTimer)}
          </div>
          <button 
            onClick={handleEndCall}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-red-950/20 transition-all"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* 2. Main content split pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side: Video Streams */}
        <div className="flex-1 bg-slate-950 relative p-4 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Main Remote stream box */}
          <div className="w-full h-full rounded-3xl bg-slate-900 border border-slate-800/80 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
            
            {/* Pulsing visual grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Peer camera simulation */}
            {camActive ? (
              <div className="w-full h-full flex items-center justify-center relative bg-slate-950/30">
                <div className="text-center space-y-4 relative z-10">
                  <div className="relative inline-block">
                    {user?.role === 'doctor' ? (
                      <div className="h-28 w-28 rounded-full bg-clinic-600/10 border border-clinic-500/20 flex items-center justify-center text-4xl shadow-inner font-extrabold text-clinic-400">
                        {peerName?.slice(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <img 
                        src={appointment.doctorId?.photo} 
                        alt={peerName} 
                        className="h-28 w-28 rounded-full object-cover border-2 border-rose-500/30 shadow-lg"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-150 text-base">{peerName}</h3>
                    <p className="text-xs text-slate-400 font-medium">{peerTitle}</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400">
                    <Activity className="h-3 w-3 animate-pulse" />
                    Webcam Stream Encrypted
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <VideoOff className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-bold">Remote Camera Feed Suspended</p>
              </div>
            )}

            {/* Float Overlay Badge */}
            <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800/80 px-3.5 py-1.5 rounded-2xl backdrop-blur flex items-center gap-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{peerName}</span>
            </div>
            
            {/* Local Stream (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-40 h-28 rounded-2xl bg-slate-950 border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center z-10">
              {camActive ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative bg-slate-900">
                  <span className="text-xs font-mono font-bold text-rose-400">YOU</span>
                  <span className="text-[10px] text-slate-400">Camera Active</span>
                  <div className="absolute bottom-1.5 left-2.5 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded text-[8px] font-bold">
                    {micActive ? <Mic className="h-2.5 w-2.5 text-emerald-400" /> : <MicOff className="h-2.5 w-2.5 text-red-400" />}
                    <span>Local</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <VideoOff className="h-5 w-5 text-slate-500 mx-auto" />
                  <span className="text-[9px] text-slate-400 font-bold block">Camera Off</span>
                </div>
              )}
            </div>

            {/* In-Call controls overlay overlaying the video area */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-800/80 px-4 py-2 rounded-2xl flex items-center gap-3.5 backdrop-blur shadow-2xl z-10">
              <button 
                onClick={() => setMicActive(!micActive)}
                className={`p-2.5 rounded-xl transition-all ${
                  micActive 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                    : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                }`}
                title={micActive ? "Mute Mic" : "Unmute Mic"}
              >
                {micActive ? <Mic className="h-4.5 w-4.5" /> : <MicOff className="h-4.5 w-4.5" />}
              </button>
              
              <button 
                onClick={() => setCamActive(!camActive)}
                className={`p-2.5 rounded-xl transition-all ${
                  camActive 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                    : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                }`}
                title={camActive ? "Turn Cam Off" : "Turn Cam On"}
              >
                {camActive ? <Video className="h-4.5 w-4.5" /> : <VideoOff className="h-4.5 w-4.5" />}
              </button>

              <button 
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-2.5 rounded-xl transition-all ${
                  screenSharing 
                    ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Share Screen"
              >
                <Monitor className="h-4.5 w-4.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Side: Immersive Clinical Workspace Sidebar */}
        <div className="w-full md:w-96 bg-slate-900 border-l border-slate-850 flex flex-col h-full overflow-hidden shrink-0 text-left">
          
          {/* Tab Navigation header */}
          <div className="bg-slate-950/40 border-b border-slate-800 flex shrink-0">
            <button
              onClick={() => setActiveTab('rx')}
              className={`flex-1 py-3 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 transition-all focus:outline-none ${
                activeTab === 'rx'
                  ? 'border-rose-500 text-rose-400 bg-slate-800/10'
                  : 'border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-800/5'
              }`}
            >
              <Pill className="h-3.5 w-3.5" />
              {user?.role === 'doctor' ? 'Rx Writer' : 'Advice'}
            </button>
            <button
              onClick={() => setActiveTab('locker')}
              className={`flex-1 py-3 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 transition-all focus:outline-none ${
                activeTab === 'locker'
                  ? 'border-rose-500 text-rose-400 bg-slate-800/10'
                  : 'border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-800/5'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Locker
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 transition-all focus:outline-none ${
                activeTab === 'chat'
                  ? 'border-rose-500 text-rose-400 bg-slate-800/10'
                  : 'border-transparent text-slate-400 hover:text-slate-250 hover:bg-slate-800/5'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </button>
          </div>

          {/* Sidebar Body (Scrollable) */}
          {/* Sidebar Body */}
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col overflow-hidden h-full">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 flex flex-col">
                {chatMessages.map((msg, idx) => {
                  if (msg.sender === 'system') {
                    return (
                      <div key={idx} className="bg-slate-950/40 border border-slate-850 px-3.5 py-2 rounded-2xl text-[10px] text-slate-500 text-center font-bold font-mono">
                        {msg.text}
                      </div>
                    );
                  }
                  const isLocal = msg.sender === 'local';
                  return (
                    <div key={idx} className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isLocal 
                        ? 'bg-rose-600 text-white rounded-tr-none self-end text-right' 
                        : 'bg-slate-950 border border-slate-850 text-slate-200 rounded-tl-none self-start text-left'
                    }`}>
                      <div className="font-extrabold text-[9px] opacity-60 uppercase mb-0.5 tracking-wider">
                        {isLocal ? 'You' : (user?.role === 'doctor' ? 'Patient' : 'Doctor')}
                      </div>
                      <p>{msg.text}</p>
                      <span className="block text-[8px] text-white/50 text-right mt-1 font-mono">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850 bg-slate-950/30 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type a clinical message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* A. DOCTOR PERSPECTIVE WORKSPACE */}
              {user?.role === 'doctor' && (
                <>
                  {activeTab === 'rx' && (
                    <div className="space-y-4">
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                        <h4 className="font-extrabold text-xs text-rose-400 uppercase tracking-wider mb-1">Diagnostic Reason</h4>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">"{appointment.reason}"</p>
                      </div>

                      <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                        <div className="space-y-3 p-4 bg-slate-950/40 border border-slate-850 rounded-2xl text-xs">
                          <h4 className="font-extrabold text-[11px] text-slate-300 uppercase tracking-wide border-b border-slate-800/80 pb-1.5 flex items-center gap-1">
                            <Plus className="h-3.5 w-3.5 text-rose-400" />
                            Add Drug / Medicine
                          </h4>
                          
                          <div className="space-y-2.5">
                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Drug Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Atenolol, Paracetamol"
                                value={medName}
                                onChange={(e) => setMedName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Dosage</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 500mg, 1 tab"
                                  value={medDosage}
                                  onChange={(e) => setMedDosage(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Duration</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 5 Days, 1 Month"
                                  value={medDuration}
                                  onChange={(e) => setMedDuration(e.target.value)}
                                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Frequency</label>
                              <select
                                value={medFrequency}
                                onChange={(e) => setMedFrequency(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                              >
                                <option>Once daily (Morning - Before meal)</option>
                                <option>Once daily (Morning - After meal)</option>
                                <option>Once daily (Night - After meal)</option>
                                <option>Twice daily (Morning & Night - After meal)</option>
                                <option>Three times daily (After meals)</option>
                                <option>As needed (SOS)</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddMedicine}
                              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 py-2 rounded-xl text-xs font-bold transition-all"
                            >
                              Add to Scratchpad
                            </button>
                          </div>
                        </div>

                        {/* medicines scratch list */}
                        <div className="space-y-2.5">
                          <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">Active Drugs List ({medsList.length})</h4>
                          {medsList.length === 0 ? (
                            <div className="bg-slate-950/20 border border-slate-850 rounded-2xl p-4 text-center text-xs text-slate-500 italic">
                              No drugs added to Rx charts yet.
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-56 overflow-y-auto">
                              {medsList.map((med, idx) => (
                                <div key={idx} className="bg-slate-950/60 border border-slate-850/80 p-3 rounded-xl flex items-center justify-between text-xs">
                                  <div>
                                    <h5 className="font-extrabold text-slate-200">{med.name} &bull; <span className="text-slate-400 font-semibold">{med.dosage}</span></h5>
                                    <p className="text-[10px] text-slate-400">{med.frequency} &bull; Duration: {med.duration}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMedicine(idx)}
                                    className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 transition-all"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* General Clinical Advice */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Dietary & clinical Advice</label>
                          <textarea
                            rows="3"
                            placeholder="e.g. Drink plenty of water, avoid cholesterol heavy foods, rest well."
                            value={advice}
                            onChange={(e) => setAdvice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-250 text-xs p-3 rounded-xl focus:outline-none resize-none leading-relaxed"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submitRxLoading}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-1.5"
                        >
                          {submitRxLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Finalizing Consultation...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Submit Rx & Complete Call
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === 'locker' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-xs text-slate-350 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                        Patient's Secure Health Locker
                      </h3>

                      {lockerLoading ? (
                        <div className="py-10 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-xs">Accessing locker records...</span>
                        </div>
                      ) : lockerRecords.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-xs italic bg-slate-950/20 border border-slate-850 rounded-3xl p-6 leading-relaxed">
                          No report documents uploaded in the patient's secure locker yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {lockerRecords.map((rec) => (
                            <div key={rec._id} className="bg-slate-950/40 border border-slate-850/80 p-3.5 rounded-2xl text-xs text-left space-y-2 hover:border-slate-800 transition-all">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4 className="font-bold text-slate-200">{rec.title}</h4>
                                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-slate-450 uppercase tracking-wide">{rec.type}</span>
                                </div>
                                
                                <a
                                  href={rec.fileUrl}
                                  download={`${rec.title}.pdf`}
                                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                  title="Download PDF Scan"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </a>
                              </div>
                              {rec.notes && <p className="text-[11px] text-slate-400 italic">Remarks: "{rec.notes}"</p>}
                              <span className="text-[9px] text-slate-550 block">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* B. PATIENT PERSPECTIVE WORKSPACE */}
              {user?.role === 'patient' && (
                <>
                  {activeTab === 'rx' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                          Doctor Advice Charts
                        </h3>
                        <button
                          type="button"
                          onClick={() => checkLivePrescription(appointment._id)}
                          disabled={checkRxLoading}
                          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1 text-[10px] font-semibold"
                          title="Reload prescription charts"
                        >
                          <RefreshCw className={`h-3 w-3 ${checkRxLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>

                      {checkRxLoading && !livePrescription ? (
                        <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-xs">Synchronizing doctor's live advisor pad...</span>
                        </div>
                      ) : livePrescription ? (
                        <div className="space-y-4">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-left space-y-1.5">
                            <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                              <CheckCircle2 className="h-4 w-4" />
                              Prescription Chart Finalized!
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Your consulting doctor has finalized the diagnosis notes. You can view this Rx in your portal dashboard.
                            </p>
                          </div>

                          <div className="space-y-2.5">
                            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Drug Directives</h4>
                            {livePrescription.medicines?.map((med, i) => (
                              <div key={i} className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs space-y-1">
                                <h5 className="font-extrabold text-slate-200">{med.name} &bull; <span className="text-slate-400 font-semibold">{med.dosage}</span></h5>
                                <p className="text-[10px] text-slate-450 text-slate-400">{med.frequency} &bull; Duration: {med.duration}</p>
                              </div>
                            ))}
                          </div>

                          {livePrescription.advice && (
                            <div className="space-y-1.5">
                              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Diet & Clinical Advice</h4>
                              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl text-xs leading-relaxed text-slate-350 italic">
                                "{livePrescription.advice}"
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              const doctor = livePrescription.doctorId || appointment.doctorId;
                              printPrescription(livePrescription, profile, doctor, appointment?.hospitalId);
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 mt-2"
                          >
                            <FileText className="h-4 w-4" />
                            Print Prescription (PDF)
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-16 text-slate-500 space-y-3 bg-slate-950/20 border border-slate-850 rounded-3xl p-6 leading-relaxed">
                          <Loader2 className="h-6 w-6 text-rose-500 animate-spin mx-auto" />
                          <h4 className="font-extrabold text-xs text-slate-350">Doctor is drafting advice...</h4>
                          <p className="text-[10px] text-slate-450 leading-normal">
                            Once the practitioner completes writing your drugs directives and digital prescriptions, it will show up here in real time.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'locker' && (
                    <div className="space-y-5">
                      {/* Upload widget in-call */}
                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-xs text-left space-y-3">
                        <h4 className="font-extrabold text-[11px] text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                          <Plus className="h-4 w-4 text-rose-400" />
                          Share Report Instantly
                        </h4>

                        <form onSubmit={handleUploadRecord} className="space-y-2.5">
                          <div>
                            <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Title</label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Sugar level report today"
                              value={uploadTitle}
                              onChange={(e) => setUploadTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Type</label>
                              <select
                                value={uploadType}
                                onChange={(e) => setUploadType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-2 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                              >
                                <option value="report">Lab Report</option>
                                <option value="prescription">Rx Scan</option>
                                <option value="other">Other PDF</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Remarks</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Fasting 105"
                                value={uploadNotes}
                                onChange={(e) => setUploadNotes(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={uploadLoading}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                          >
                            {uploadLoading ? 'Sharing report...' : 'Upload & Share Now'}
                          </button>
                        </form>
                      </div>

                      {/* Shared files list */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-slate-350 uppercase tracking-wide">
                          My Shared Locker Records
                        </h4>

                        {lockerLoading ? (
                          <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-[10px]">Loading health charts locker...</span>
                          </div>
                        ) : lockerRecords.length === 0 ? (
                          <p className="text-[11px] text-slate-550 italic text-center py-6">No reports uploaded yet.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {lockerRecords.map((rec) => (
                              <div key={rec._id} className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl text-xs text-left space-y-1.5 hover:border-slate-800 transition-all">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-slate-200 leading-tight">{rec.title}</h5>
                                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[8px] font-bold text-slate-450 uppercase tracking-wider">{rec.type}</span>
                                  </div>
                                  <a
                                    href={rec.fileUrl}
                                    download={`${rec.title}.pdf`}
                                    className="p-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded transition-all"
                                    title="Download File Scan"
                                  >
                                    <Download className="h-3 w-3" />
                                  </a>
                                </div>
                                <span className="text-[9px] text-slate-550 block text-slate-500">Uploaded: {new Date(rec.uploadedAt).toLocaleDateString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default VideoCall;
