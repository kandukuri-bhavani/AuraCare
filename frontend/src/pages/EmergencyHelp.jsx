import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import { ShieldAlert, PhoneCall, Heart, MapPin, Award, Loader2, RefreshCw } from 'lucide-react';

const EmergencyHelp = () => {
  const [emergencyHospitals, setEmergencyHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathPoints = [
    { x: 30, y: 150 },
    { x: 100, y: 150 },
    { x: 100, y: 80 },
    { x: 220, y: 80 },
    { x: 220, y: 180 },
    { x: 350, y: 180 },
    { x: 350, y: 110 },
    { x: 450, y: 110 }
  ];

  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchActive, setDispatchActive] = useState(false);

  useEffect(() => {
    let interval;
    if (dispatchActive) {
      interval = setInterval(() => {
        setDispatchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 350);
    } else {
      setDispatchProgress(0);
    }
    return () => clearInterval(interval);
  }, [dispatchActive]);

  const getCoordinates = (prog) => {
    if (prog <= 0) return pathPoints[0];
    if (prog >= 100) return pathPoints[pathPoints.length - 1];

    const segmentCount = pathPoints.length - 1;
    const progressPerSegment = 100 / segmentCount;
    const currentSegmentIndex = Math.min(
      Math.floor(prog / progressPerSegment),
      segmentCount - 1
    );
    const segmentProgress = (prog % progressPerSegment) / progressPerSegment;

    const p1 = pathPoints[currentSegmentIndex];
    const p2 = pathPoints[currentSegmentIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  };

  const { x, y } = getCoordinates(dispatchProgress);

  const loadEmergencyCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await hospitalAPI.getAll({ emergencyOnly: 'true' });
      setEmergencyHospitals(res.data);
    } catch (err) {
      console.error('Fetch emergency error:', err);
      setError('Could not fetch active emergency networks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmergencyCenters();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. High Impact Emergency Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emergency-600 via-slate-900 to-slate-950 text-white py-16">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-emergency-500/20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emergency-500/10 border border-emergency-400/20 text-emergency-500 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            24/7 Crisis Response Active
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white">
            Emergency Care Hotline
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            If you or a family member are experiencing immediate medical emergencies (cardiac arrest, respiratory failure, severe trauma), dial National Ambulances or locate our active ER wards below.
          </p>

          {/* Speed Dial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl pt-2">
            
            <a href="tel:102" className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/15 transition-all text-left flex items-start gap-4 shadow-lg">
              <div className="bg-emergency-600 p-3 rounded-xl text-white animate-bounce">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Ambulance Fleet</div>
                <div className="text-xl font-black text-white">Dial 102</div>
              </div>
            </a>

            <a href="tel:108" className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/15 transition-all text-left flex items-start gap-4 shadow-lg">
              <div className="bg-emergency-600 p-3 rounded-xl text-white">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Disaster Helpline</div>
                <div className="text-xl font-black text-white">Dial 108</div>
              </div>
            </a>

            <a href="tel:112" className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/15 transition-all text-left flex items-start gap-4 shadow-lg">
              <div className="bg-emergency-600 p-3 rounded-xl text-white">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">Unified Emergency</div>
                <div className="text-xl font-black text-white">Dial 112</div>
              </div>
            </a>

          </div>
        </div>
      </div>

      {/* 2. Placeholders for Bed Trackers and Blood Banks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft text-left space-y-3">
            <div className="h-2 w-full bg-emergency-600 rounded-full"></div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Critical ICU Beds</h4>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-800">42</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">Active tracking</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">Bed availability is synced across regional hospitals every 5 minutes.</p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft text-left space-y-3">
            <div className="h-2 w-full bg-clinic-600 rounded-full"></div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Blood Bank Inventories</h4>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-800">180+</span>
              <span className="text-xs text-clinic-700 font-bold bg-clinic-50 border border-clinic-100 px-2 py-0.5 rounded">Units Available</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">O-ve, A+ve, B+ve groups have high stock availability in regional blood caches.</p>
          </div>

          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-soft text-left space-y-3">
            <div className="h-2 w-full bg-sage-600 rounded-full"></div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Active Ambulance Fleet</h4>
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-slate-800">15</span>
              <span className="text-xs text-sage-700 font-bold bg-sage-50 border border-sage-100 px-2 py-0.5 rounded">GPS Tracked</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-normal">Ambulances are stationed at designated city traffic corridors for rapid response.</p>
          </div>

        </div>

        {/* Live GPS Dispatch Tracker Panel */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft mb-10 text-left space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                </span>
                GPS Ambulance Dispatch Control
              </h2>
              <p className="text-slate-400 text-xs font-medium">Request instant paramedic support and track emergency vehicles in real-time.</p>
            </div>
            
            {!dispatchActive ? (
              <button
                onClick={() => {
                  setDispatchActive(true);
                  setDispatchProgress(0);
                }}
                className="px-5 py-2.5 bg-emergency-600 hover:bg-emergency-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg transition-all animate-pulse"
              >
                🚨 Request Dispatch Now
              </button>
            ) : (
              <button
                onClick={() => {
                  setDispatchActive(false);
                  setDispatchProgress(0);
                }}
                className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-750 border border-slate-250 rounded-xl text-xs font-bold transition-all"
              >
                Reset / Cancel Call
              </button>
            )}
          </div>

          {dispatchActive ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: SVG Map Simulation */}
              <div className="lg:col-span-8 bg-slate-950 p-4 rounded-3xl border border-slate-800 relative shadow-inner overflow-hidden min-h-[280px] flex items-center justify-center">
                {/* Flashing ambient light borders for emergency sirens */}
                <div className={`absolute inset-0 border-2 rounded-3xl transition-colors duration-300 pointer-events-none ${
                  dispatchProgress === 100 ? 'border-emerald-500/30' :
                  dispatchProgress % 2 === 0 ? 'border-red-500/20' : 'border-blue-500/20'
                }`}></div>

                <svg viewBox="0 0 500 250" className="w-full h-full bg-slate-900 rounded-2xl relative overflow-hidden select-none">
                  {/* Grid overlay */}
                  <defs>
                    <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Street grid outlines (mock city map blocks) */}
                  <rect x="25" y="25" width="50" height="100" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="100" y="25" width="100" height="40" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="225" y="25" width="100" height="45" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="350" y="25" width="125" height="65" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="25" y="150" width="150" height="75" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="200" y="150" width="125" height="75" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />
                  <rect x="350" y="150" width="125" height="75" rx="4" fill="rgba(255, 255, 255, 0.01)" stroke="rgba(255, 255, 255, 0.04)" />

                  {/* Planned dispatch route (dashed line) */}
                  <path
                    d="M 30 150 L 100 150 L 100 80 L 220 80 L 220 180 L 350 180 L 350 110 L 450 110"
                    fill="none"
                    stroke="rgba(239, 68, 68, 0.15)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 30 150 L 100 150 L 100 80 L 220 80 L 220 180 L 350 180 L 350 110 L 450 110"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="6,4"
                  />

                  {/* Start point (Hospital) */}
                  <circle cx="30" cy="150" r="5" fill="#10b981" />
                  <circle cx="30" cy="150" r="10" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '30px 150px' }} />
                  
                  {/* End point (Patient Location) */}
                  <circle cx="450" cy="110" r="5" fill="#ef4444" />
                  <circle cx="450" cy="110" r="12" fill="none" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ transformOrigin: '450px 110px' }} />

                  {/* Ambulance Marker icon */}
                  <g transform={`translate(${x - 10}, ${y - 10})`}>
                    {/* Flashing ambient siren glow */}
                    <circle cx="10" cy="10" r="14" fill={dispatchProgress % 2 === 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'} />
                    
                    {/* Marker pin body */}
                    <rect x="2" y="4" width="16" height="12" rx="2" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
                    {/* Red cross */}
                    <path d="M 10 7 L 10 13 M 7 10 L 13 10" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
                    {/* Flashing beacon lights */}
                    <circle cx="7" cy="3" r="1.2" fill={dispatchProgress % 2 === 0 ? '#ef4444' : '#3b82f6'} />
                    <circle cx="13" cy="3" r="1.2" fill={dispatchProgress % 2 === 0 ? '#3b82f6' : '#ef4444'} />
                  </g>
                </svg>
              </div>

              {/* Right Column: Live Status Metrics */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Ambulance ETA</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      dispatchProgress === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100 animate-pulse'
                    }`}>
                      {dispatchProgress === 100 ? 'ARRIVED' : 'EN ROUTE'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-800 font-mono">
                      {Math.max(0, (8 - (dispatchProgress * 0.08)).toFixed(1))}
                    </span>
                    <span className="text-sm font-bold text-slate-500">minutes left</span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emergency-600 transition-all duration-300"
                        style={{ width: `${dispatchProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                      <span>RMLIMS Trauma Ctr</span>
                      <span>Your Location</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3 font-semibold text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                      dispatchProgress >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Dispatch Request Logged</p>
                      <p className="text-[10px] text-slate-400">Validated with emergency triage desk</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                      dispatchProgress >= 10 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {dispatchProgress >= 10 ? '✓' : '2'}
                    </div>
                    <div>
                      <p className={`font-bold ${dispatchProgress >= 10 ? 'text-slate-800' : 'text-slate-400'}`}>Vehicle Assigned</p>
                      <p className="text-[10px] text-slate-400">Ambulance Fleet ID: #AMB-392</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                      dispatchProgress >= 50 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      dispatchProgress >= 10 ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {dispatchProgress >= 50 ? '✓' : '3'}
                    </div>
                    <div>
                      <p className={`font-bold ${dispatchProgress >= 10 ? 'text-slate-800' : 'text-slate-400'}`}>En Route</p>
                      <p className="text-[10px] text-slate-400">
                        {dispatchProgress === 100 ? 'Ambulance reached destination.' :
                         dispatchProgress >= 75 ? 'Entering patient\'s local street corridor.' :
                         dispatchProgress >= 40 ? 'Passing through Ring Road intersection.' :
                         dispatchProgress >= 10 ? 'Speeding through Central Wards Highway.' : 'Waiting for dispatch.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                      dispatchProgress === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      4
                    </div>
                    <div>
                      <p className={`font-bold ${dispatchProgress === 100 ? 'text-slate-800' : 'text-slate-400'}`}>Arrived at Destination</p>
                      <p className="text-[10px] text-slate-400">Medical crew on site. Initiate emergency protocols.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-3xl p-10 bg-slate-50/50 flex flex-col items-center justify-center gap-3 text-center py-12">
              <ShieldAlert className="h-10 w-10 text-slate-350" />
              <h3 className="font-extrabold text-sm text-slate-700">Simulate Real-time Route Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">Click "Request Dispatch Now" to trigger a simulated GPS route tracking stream representing an ambulance traveling to your coordinates.</p>
            </div>
          )}
        </div>

        {/* 3. 24/7 Wards Hospital Directory List */}
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-3xl shadow-soft">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-100 pb-4 mb-6 gap-3">
            <div className="text-left space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emergency-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emergency-600"></span>
                </span>
                Active 24/7 Emergency Wards
              </h2>
              <p className="text-slate-400 text-xs font-medium">Locate verified hospitals containing active trauma teams and surgical ICUs.</p>
            </div>
            
            <button
              onClick={loadEmergencyCenters}
              className="text-xs font-semibold text-clinic-700 hover:text-clinic-800 flex items-center gap-1 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Registry
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
              <span className="text-slate-400 text-sm font-medium">Filtering emergency registry database...</span>
            </div>
          ) : error ? (
            <p className="text-red-700 text-center font-bold text-xs py-10">{error}</p>
          ) : emergencyHospitals.length === 0 ? (
            <p className="text-slate-400 text-center text-xs py-10">No active 24/7 trauma hospitals found in this region.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {emergencyHospitals.map((hospital) => (
                <div key={hospital._id} className="p-5 border border-emergency-100 bg-emergency-50/10 rounded-2xl flex flex-col justify-between hover:shadow-soft transition-all space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-emergency-600 uppercase tracking-wide">
                      <span>{hospital.city} Verified</span>
                      <span>★ {hospital.rating}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">{hospital.name}</h3>
                    <p className="text-slate-400 text-xs leading-normal flex items-start gap-1">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
                      {hospital.address}
                    </p>
                  </div>

                  {hospital.governmentSchemes.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-clinic-600 shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {hospital.governmentSchemes.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-clinic-50 border border-clinic-100 text-clinic-700 text-[8px] font-bold rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-semibold">Ambulance Fleet Contact</span>
                      <a href={`tel:${hospital.ambulanceContact}`} className="text-sm font-black text-emergency-600 hover:underline">
                        {hospital.ambulanceContact}
                      </a>
                    </div>
                    
                    <Link
                      to={`/hospitals/${hospital._id}`}
                      className="px-3.5 py-2 bg-emergency-600 hover:bg-emergency-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all animate-pulse"
                    >
                      Locate ICU & Wards
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default EmergencyHelp;
