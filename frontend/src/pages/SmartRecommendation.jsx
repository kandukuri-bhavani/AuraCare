import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import { Sparkles, MapPin, Stethoscope, Landmark, Award, ShieldAlert, BadgeInfo, CheckCircle, Loader2, CalendarDays } from 'lucide-react';

const SmartRecommendation = () => {
  const [city, setCity] = useState('');
  const [healthProblem, setHealthProblem] = useState('');
  const [incomeRange, setIncomeRange] = useState('middle');
  const [selectedScheme, setSelectedScheme] = useState('');
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommendSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      alert('Please select a City.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const params = {
        city: city.trim(),
        healthProblem: healthProblem.trim(),
        incomeRange,
        selectedScheme
      };

      const res = await hospitalAPI.getRecommendations(params);
      setRecommendations(res.data);
    } catch (err) {
      console.error('Smart recommendation failed:', err);
      setError('Could not process recommendation scoring. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page header */}
      <div className="text-left max-w-3xl mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-clinic-50 border border-clinic-100 text-clinic-700 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-clinic-600 animate-pulse" />
          AI Affordability & Specialization Matcher
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smart Hospital Matcher</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Struggling to find which local clinic is affordable and eligible for your health insurance card? 
          Enter your metrics below. Our matcher translates your symptoms to medical departments, sorts hospitals by your income range, and prioritized cashless government benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column Form inputs (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-soft text-left space-y-6">
          <h3 className="font-extrabold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-clinic-600 shrink-0" />
            Specify Patient Metrics
          </h3>

          <form onSubmit={handleRecommendSubmit} className="space-y-4">
            
            {/* Input 1: City */}
            <div>
              <label className="input-label">Select City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Input 2: Symptoms */}
            <div>
              <label className="input-label">Describe Health Complaint / Symptoms (Optional)</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Describe your health complaint or symptoms"
                  value={healthProblem}
                  onChange={(e) => setHealthProblem(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Our algorithm parses symptoms to match specific departments (Cardiology, Orthopedics, etc.)</p>
            </div>

            {/* Input 3: Income Range */}
            <div>
              <label className="input-label">Annual Income Bracket</label>
              <div className="relative">
                <Landmark className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={incomeRange}
                  onChange={(e) => setIncomeRange(e.target.value)}
                  className="input-field pl-9"
                >
                  <option value="low">Low Income Group (Prioritize Cashless Wards)</option>
                  <option value="middle">Middle Income Group (Prioritize Moderate Pricing)</option>
                  <option value="high">High Income Group (Prioritize Top Ratings & Facilities)</option>
                </select>
              </div>
            </div>

            {/* Input 4: Preferred Government scheme */}
            <div>
              <label className="input-label">Select Registered Scheme Card (Optional)</label>
              <div className="relative">
                <Award className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="input-field pl-9"
                >
                  <option value="">No Active Government Welfare Cards</option>
                  <option value="Ayushman Bharat PM-JAY">Ayushman Bharat PM-JAY</option>
                  <option value="CGHS">Central Government Health Scheme (CGHS)</option>
                  <option value="State Low-Income Health Plan">State Low-Income Health Card</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 shadow-md flex items-center justify-center gap-2 text-sm font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing hospital directories...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Perform Smart Matching
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column Results display (lg:col-span-7) */}
        <div className="lg:col-span-7 text-left space-y-4">
          
          {!searched ? (
            // Default layout before searching
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-4 shadow-soft">
              <div className="bg-clinic-50 p-4 rounded-full h-16 w-16 mx-auto flex items-center justify-center text-clinic-600 border border-clinic-100">
                <Sparkles className="h-8 w-8 text-clinic-700 animate-pulse" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">Awaiting Your Input</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Fill in the patient details on the left. The recommendation engine will filter nearby clinics and sort them dynamically.
              </p>
            </div>
          ) : loading ? (
            // Loader layout
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-4 shadow-soft">
              <Loader2 className="h-8 w-8 text-clinic-600 animate-spin mx-auto" />
              <h3 className="text-slate-800 font-semibold text-sm">Processing Clinic Data...</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">Evaluating pricing tags, specialty capabilities, and scheme databases.</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
              <p className="text-red-800 font-semibold text-sm">{error}</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-4 shadow-soft">
              <div className="bg-slate-50 p-4 rounded-full h-16 w-16 mx-auto flex items-center justify-center text-slate-400 border border-slate-150">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No Eligible Matches Found</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                No hospitals matched the required criteria for this city. Try changing locations or looking without specific scheme cards.
              </p>
            </div>
          ) : (
            // Results list
            <div className="space-y-4 animate-fade-in">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Match Analysis Completed: {recommendations.length} Recommended Hospitals
              </div>

              {recommendations?.map(({ hospital, score, targetDept, matchReasons, bestDoctor }, index) => (
                <div
                  key={hospital._id}
                  className={`glass-card p-6 border relative overflow-hidden flex flex-col sm:flex-row gap-5 ${
                    index === 0
                      ? 'border-clinic-300 ring-2 ring-clinic-500/10 shadow-premium'
                      : 'border-slate-100/60 shadow-soft'
                  }`}
                >
                  {/* Visual Recommendation badge */}
                  <div className="absolute top-0 right-0 bg-clinic-600 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl tracking-wider">
                    {index === 0 ? 'Best Choice' : `#${index + 1} Priority`}
                  </div>

                  {/* Left segment: score circle */}
                  <div className="flex flex-col items-center justify-center shrink-0 sm:border-r border-slate-100 sm:pr-5">
                    <div className="h-16 w-16 bg-clinic-50 rounded-full flex flex-col items-center justify-center border border-clinic-100 shadow-sm">
                      <span className="text-xs text-slate-400 font-semibold leading-none">Score</span>
                      <span className="text-base font-extrabold text-clinic-700 mt-0.5">{Math.min(100, Math.floor(score))}%</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-2">Match index</span>
                  </div>

                  {/* Right segment: hospital details */}
                  <div className="flex-1 text-left space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-base leading-snug">{hospital.name}</h4>
                      <p className="text-slate-400 text-xs leading-normal">{hospital.address}</p>
                    </div>

                    {/* Department badge & coordinates details */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 font-bold rounded">
                        Target Dept: {targetDept}
                      </span>
                      <span className="text-[10px] text-amber-500 font-bold">
                        ★ {hospital.rating} Rating
                      </span>
                    </div>

                    {/* Explanations row */}
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl space-y-2">
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <BadgeInfo className="h-3.5 w-3.5 text-clinic-600 shrink-0" />
                        Why Recommended:
                      </div>
                      <div className="space-y-1">
                        {matchReasons?.map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Suggested Expert Panel */}
                    {bestDoctor && (
                      <div className="border border-clinic-100 bg-clinic-50/20 p-3.5 rounded-2xl space-y-2.5">
                        <div className="text-[9px] text-clinic-700 font-black uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5 text-clinic-605 shrink-0 animate-pulse text-clinic-600" />
                          AI Suggested Specialty Expert:
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={bestDoctor.photo}
                              alt={bestDoctor.name}
                              className="h-11 w-11 rounded-full object-cover border border-clinic-200/50 bg-slate-50 shrink-0"
                            />
                            <div>
                              <h5 className="text-xs font-bold text-slate-800">{bestDoctor.name}</h5>
                              <p className="text-[10px] text-clinic-600 font-semibold">{bestDoctor.specialization} &bull; {bestDoctor.experience} Yrs Exp</p>
                              <span className="text-[9px] text-slate-450 text-slate-500 font-medium">Fee: ₹{bestDoctor.consultationFee}</span>
                            </div>
                          </div>
                          <Link
                            to={`/hospitals/${hospital._id}?bookDocId=${bestDoctor._id}`}
                            className="px-3 py-1.5 bg-clinic-700 hover:bg-clinic-800 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                          >
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                            Quick Book
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Footer price & CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-medium">Estimated Pricing</span>
                        <span className="text-sm font-extrabold text-slate-800">
                          ₹{hospital.minPrice} - ₹{hospital.maxPrice}
                        </span>
                      </div>
                      <Link
                        to={`/hospitals/${hospital._id}`}
                        className="px-4 py-2 bg-clinic-700 hover:bg-clinic-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        Book Wards
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

export default SmartRecommendation;
