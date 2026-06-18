import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import { Search, MapPin, SlidersHorizontal, Stethoscope, ShieldAlert, Award, Loader2 } from 'lucide-react';

const HospitalSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read search configurations from URL query params
  const cityQuery = searchParams.get('city') || '';
  const searchInput = searchParams.get('search') || '';

  // Local Filter States
  const [city, setCity] = useState(cityQuery);
  const [search, setSearch] = useState(searchInput);
  const [department, setDepartment] = useState('');
  const [scheme, setScheme] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        city: city.trim(),
        search: search.trim(),
        department,
        scheme,
        emergencyOnly: emergencyOnly ? 'true' : 'false',
        minPrice,
        maxPrice
      };

      const res = await hospitalAPI.getAll(filters);
      setHospitals(res.data);
    } catch (err) {
      console.error('Fetch hospitals error:', err);
      setError('Could not connect to medical registry. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger loading when URL or local params submit
  useEffect(() => {
    fetchHospitals();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (city) newParams.city = city;
    if (search) newParams.search = search;
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setCity('');
    setSearch('');
    setDepartment('');
    setScheme('');
    setEmergencyOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header Banner */}
      <div className="text-left mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinical Directories</h1>
        <p className="text-slate-500 text-sm">Find hospitals, ICU wards, ambulance services, and consult doctors based on your affordability profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-soft text-left space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-clinic-600" />
              Advanced Filters
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-clinic-600 hover:underline hover:text-clinic-700"
            >
              Wipe Clean
            </button>
          </div>

          <form onSubmit={handleFilterSubmit} className="space-y-4">
            
            {/* Input 1: Search Text */}
            <div>
              <label className="input-label">Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hospital name or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Input 2: Location/City */}
            <div>
              <label className="input-label">Select City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Input 3: Department Specialization */}
            <div>
              <label className="input-label">Medical Specialty</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="input-field"
              >
                <option value="">All Departments</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology (Heart)</option>
                <option value="Orthopedics">Orthopedics (Bones)</option>
                <option value="Pediatrics">Pediatrics (Kids)</option>
                <option value="Neurology">Neurology (Brain)</option>
                <option value="Dermatology">Dermatology (Skin)</option>
                <option value="Gynaecology">Gynaecology (Women)</option>
              </select>
            </div>

            {/* Input 4: Scheme benefits */}
            <div>
              <label className="input-label">Insurance / Welfare Schemes</label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                className="input-field"
              >
                <option value="">All Pricing Tiers</option>
                <option value="Ayushman Bharat">Ayushman Bharat PM-JAY</option>
                <option value="CGHS">CGHS Card Holders</option>
                <option value="State Low-Income">State Welfare Schemes</option>
              </select>
            </div>

            {/* Input 5: Pricing range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label">Min Cost (₹)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Max Cost (₹)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Input 6: Emergency Checkbox */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                id="emergencyOnly"
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="h-4 w-4 text-clinic-600 border-slate-300 rounded focus:ring-clinic-500"
              />
              <label htmlFor="emergencyOnly" className="text-sm font-semibold text-emergency-600 flex items-center gap-1 cursor-pointer">
                <ShieldAlert className="h-4 w-4 animate-pulse" />
                Active 24/7 Emergency Wards
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 mt-4 text-sm font-bold shadow-soft"
            >
              Apply Filter Matches
            </button>

          </form>
        </div>

        {/* Right Hospital Cards List (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 text-clinic-600 animate-spin" />
              <span className="text-slate-400 text-sm font-medium">Matching hospital records...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center space-y-3">
              <p className="text-red-800 font-semibold">{error}</p>
              <button onClick={fetchHospitals} className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all">
                Retry Connection
              </button>
            </div>
          ) : hospitals.length === 0 ? (
            <div className="bg-white border border-slate-150 rounded-3xl p-10 text-center space-y-4 shadow-soft">
              <div className="bg-slate-50 p-4 rounded-full h-16 w-16 mx-auto flex items-center justify-center text-slate-400 border border-slate-100">
                <Stethoscope className="h-8 w-8" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No Hospital Matches</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't find hospitals matching your inputs. Try removing price constraints or choosing "All Departments".
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-clinic-50 border border-clinic-100 text-clinic-700 hover:bg-clinic-700 hover:text-white text-xs font-bold rounded-xl transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Count indicators */}
              <div className="text-slate-500 text-xs font-bold">
                Showing {hospitals.length} verified hospitals in directory
              </div>

              {hospitals.map((hospital) => (
                <div key={hospital._id} className="glass-card flex flex-col md:flex-row overflow-hidden border border-slate-100/60 shadow-soft">
                  
                  {/* Hospital Visual Banner */}
                  <div className="md:w-1/3 relative shrink-0">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="h-full w-full min-h-[180px] md:min-h-full object-cover bg-slate-50"
                    />
                    
                    {/* Active Emergency Status Pulse */}
                    {hospital.emergencyService && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-emergency-600/90 text-white text-[9px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-md shadow-slate-900/10">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        24/7 ER SUPPORT
                      </div>
                    )}
                  </div>

                  {/* Card Content details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-clinic-600 uppercase tracking-wide">
                        <span>{hospital.city}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          ★ <span className="text-slate-700">{hospital.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-extrabold text-slate-800 text-lg leading-snug">{hospital.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{hospital.address}</p>
                    </div>

                    {/* Department Tag badges */}
                    <div className="flex flex-wrap gap-1">
                      {hospital.departments?.map((dept) => (
                        <span key={dept} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                          {dept}
                        </span>
                      ))}
                    </div>

                    {/* Scheme Benefits row */}
                    {hospital.governmentSchemes?.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <Award className="h-4 w-4 text-clinic-600 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {hospital.governmentSchemes?.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-clinic-50 border border-clinic-100 text-clinic-700 text-[9px] font-bold rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cost row & details button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wide">Consultation Price</span>
                        <span className="text-base font-extrabold text-slate-800">
                          ₹{hospital.minPrice} - ₹{hospital.maxPrice}
                        </span>
                      </div>
                      <Link
                        to={`/hospitals/${hospital._id}`}
                        className="px-4 py-2 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        Book Appointment &rarr;
                      </Link>
                    </div>

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

export default HospitalSearch;
