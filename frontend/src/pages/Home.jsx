import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hospitalAPI, doctorAPI } from '../services/api';
import { Search, MapPin, ShieldAlert, Sparkles, Building, Users, CalendarDays, Award } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchSymptom, setSearchSymptom] = useState('');
  const [topHospitals, setTopHospitals] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load sample data for landing highlights
  useEffect(() => {
    const loadHighlights = async () => {
      try {
        const hRes = await hospitalAPI.getAll();
        setTopHospitals(hRes.data.slice(0, 3));
        
        const dRes = await doctorAPI.getAll();
        setTopDoctors(dRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHighlights();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchCity) queryParams.append('city', searchCity);
    if (searchSymptom) queryParams.append('search', searchSymptom);
    navigate(`/hospitals?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-clinic-900 via-slate-900 to-slate-950 text-white py-20 lg:py-28">
        
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-clinic-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copywriting */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-clinic-500/10 border border-clinic-400/20 text-clinic-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Affordable Clinical Search Engine
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Find the Best Hospital <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-400 to-emerald-400">
                  Suited for Your Budget
                </span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                Enter your symptom, location, and income level. We instantly match you with nearby clinical specialists, 24/7 facilities, and valid government healthcare schemes.
              </p>

              {/* Central Search Widget */}
              <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2 max-w-2xl">
                <div className="flex-1 flex items-center gap-2 px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                  <MapPin className="h-5 w-5 text-clinic-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter city (e.g. Mumbai, Bangalore)..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full bg-transparent border-none text-slate-800 focus:outline-none placeholder:text-slate-400 text-sm py-1"
                  />
                </div>
                
                <div className="flex-1 flex items-center gap-2 px-3 py-2">
                  <Search className="h-5 w-5 text-clinic-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Health problem, doctor or department..."
                    value={searchSymptom}
                    onChange={(e) => setSearchSymptom(e.target.value)}
                    className="w-full bg-transparent border-none text-slate-800 focus:outline-none placeholder:text-slate-400 text-sm py-1"
                  />
                </div>

                <button type="submit" className="md:px-6 py-3 bg-clinic-700 hover:bg-clinic-800 text-white text-sm font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/smart-recommendation" className="px-6 py-3.5 bg-gradient-to-r from-clinic-600 to-emerald-600 hover:from-clinic-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-clinic-900/40 transition-all flex items-center gap-2">
                  Find Best Hospital for Me (AI Smart Match)
                </Link>
                <Link to="/hospitals" className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl transition-all">
                  Book Appointment
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Stock Healthcare Graphics Mockup */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative mx-auto w-full max-w-[400px]">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-dashed border-clinic-500/20"></div>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"
                  alt="Professional Healthcare Consultation"
                  className="rounded-2xl shadow-2xl relative z-10 border border-slate-800 object-cover aspect-[4/5] object-center"
                />
                
                {/* Floating Micro UI Widgets */}
                <div className="absolute -right-10 top-1/4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 text-slate-900 z-20 flex items-center gap-3">
                  <div className="bg-sage-100 p-2 rounded-xl text-sage-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Schemes Accepted</p>
                    <p className="text-xs font-bold text-slate-800">Ayushman Bharat & CGHS</p>
                  </div>
                </div>

                <div className="absolute -left-10 bottom-12 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 text-slate-900 z-20 flex items-center gap-3">
                  <div className="bg-emergency-500/10 p-2 rounded-xl text-emergency-500">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">24/7 Hotlines</p>
                    <p className="text-xs font-bold text-slate-800">Instant Ambulance Care</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Core Government Scheme Highlights Banner */}
      <div className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5 text-left">
              <div className="bg-clinic-50 p-3 rounded-2xl text-clinic-700 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800">Integrated Government Health Schemes</h3>
                <p className="text-xs text-slate-500">Checking eligibility and matching cashless benefits instantly.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-scheme">Ayushman Bharat PM-JAY</span>
              <span className="badge-scheme">CGHS Card</span>
              <span className="badge-scheme">State Low-Income Relief Scheme</span>
              <span className="badge-scheme">ABHA Health Locker</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Nearby Hospitals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Nearby Hospitals</h2>
            <p className="text-slate-500 text-sm mt-1">Highly-rated institutions matching pricing structures and medical slots.</p>
          </div>
          <Link to="/hospitals" className="text-clinic-700 hover:text-clinic-800 font-semibold text-sm transition-colors">
            View All Hospitals &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-white rounded-2xl border border-slate-100 shadow-soft animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topHospitals.map((hospital) => (
              <div key={hospital._id} className="glass-card flex flex-col h-full overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="h-44 w-full object-cover object-center bg-slate-100"
                />
                <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-clinic-600 font-semibold uppercase">
                      <span>{hospital.city}</span>
                      <span className="text-amber-500">★ {hospital.rating}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{hospital.name}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{hospital.address}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {hospital.departments?.slice(0, 2).map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
                        {d}
                      </span>
                    ))}
                    {hospital.departments?.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded">
                        +{hospital.departments.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Consultation Starts</span>
                      <span className="text-sm font-bold text-slate-800">₹{hospital.minPrice}</span>
                    </div>
                    <Link to={`/hospitals/${hospital._id}`} className="px-3.5 py-1.5 bg-clinic-50 text-clinic-700 hover:bg-clinic-700 hover:text-white rounded-lg text-xs font-semibold transition-all">
                      Select Hospital
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Top Doctor Highlights */}
      <div className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Specialists</h2>
            <p className="text-slate-500 text-sm mt-2">Book consultation slots with leading experts across major surgical and medical faculties.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-white rounded-2xl border border-slate-100 shadow-soft animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDoctors.map((doctor) => (
                <div key={doctor._id} className="glass-card p-6 text-center space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="h-20 w-20 rounded-full mx-auto object-cover border border-slate-200 bg-slate-50"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{doctor.name}</h3>
                      <p className="text-xs text-clinic-600 font-semibold">{doctor.specialization} &bull; {doctor.experience} Yrs Exp</p>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{doctor.hospitalName}</p>
                    <div className="text-amber-500 text-xs font-semibold">★ {doctor.rating} Rating</div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                      <span className="text-sm font-bold text-slate-800">₹{doctor.consultationFee}</span>
                    </div>
                    <Link to={`/hospitals/${doctor.hospitalId}`} className="px-3.5 py-1.5 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
                      Schedule Slot
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How "AuraCare" Works</h2>
          <p className="text-slate-500 text-sm mt-2">Three simple steps to coordinate low-cost appointments and cashless insurance coverage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Step 1 */}
          <div className="space-y-4 relative z-10 text-center">
            <div className="h-16 w-16 bg-clinic-50 border border-clinic-100 text-clinic-700 flex items-center justify-center rounded-2xl mx-auto text-xl font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Enter Symptoms & Location</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Select your city, state, or current coordinates. Input your health complaint and income range.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 relative z-10 text-center">
            <div className="h-16 w-16 bg-clinic-50 border border-clinic-100 text-clinic-700 flex items-center justify-center rounded-2xl mx-auto text-xl font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-lg">AI Matches Eligible Schemes</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Our Smart Matching Engine aligns your symptoms with local specialist pricing and government benefits automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 relative z-10 text-center">
            <div className="h-16 w-16 bg-clinic-50 border border-clinic-100 text-clinic-700 flex items-center justify-center rounded-2xl mx-auto text-xl font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Confirm Cashless Booking</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Book a date and time slot. Get a digital reservation pass with a clinical ID to present during check-in.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;
