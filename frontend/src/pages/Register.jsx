import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Building, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient'); // patient, hospital
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Patient Fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [incomeRange, setIncomeRange] = useState('middle');
  const [healthProblem, setHealthProblem] = useState('');
  const [insuranceDetails, setInsuranceDetails] = useState('');
  const [abhaId, setAbhaId] = useState('');

  // Hospital Fields
  const [hAddress, setHAddress] = useState('');
  const [hCity, setHCity] = useState('');
  const [hMinPrice, setHMinPrice] = useState('');
  const [hMaxPrice, setHMaxPrice] = useState('');
  const [hEmergency, setHEmergency] = useState(true);
  const [hDepts, setHDepts] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !name) {
      setError('Please fill in your primary details (username, email, password, and profile name)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let payload = {
        username,
        email,
        password,
        role,
        name
      };

      if (role === 'patient') {
        payload = {
          ...payload,
          age: parseInt(age) || 30,
          gender,
          phone,
          location,
          incomeRange,
          healthProblem,
          insuranceDetails,
          abhaId
        };
      } else if (role === 'hospital') {
        const departmentsArray = hDepts.split(',').map(d => d.trim()).filter(d => d.length > 0);
        payload = {
          ...payload,
          address: hAddress,
          city: hCity,
          minPrice: parseInt(hMinPrice) || 200,
          maxPrice: parseInt(hMaxPrice) || 800,
          emergencyService: hEmergency,
          departments: departmentsArray
        };
      }

      const res = await register(payload);

      if (res.success) {
        // Route dashboard depending on role
        if (role === 'patient') navigate('/');
        else if (role === 'hospital') navigate('/dashboard/hospital');
        else navigate('/');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Connection to host timed out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-clinic-50/50 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-50/30 blur-3xl -z-10"></div>

      <div className="max-w-2xl w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
        
        {/* Title header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-clinic-50 border border-clinic-100 text-clinic-600 rounded-2xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Join AuraCare and coordinate low-cost appointments instantly.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => { setRole('patient'); setError(null); }}
            className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'patient'
                ? 'bg-white text-clinic-700 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User className="h-4 w-4" />
            Patient Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setRole('hospital'); setError(null); }}
            className={`py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              role === 'hospital'
                ? 'bg-white text-clinic-700 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building className="h-4 w-4" />
            Hospital Admin
          </button>
        </div>

        {/* Error warning */}
        {(error || authError) && (
          <div className="bg-emergency-50 border border-emergency-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-emergency-700 text-xs text-left animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 text-emergency-500" />
            <div>
              <span className="font-bold">Form validation failed: </span>
              {error || authError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          
          {/* Group 1: General Credentials */}
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">1. Primary Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Role Details */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">2. Profile Specifications</h3>
            
            {role === 'patient' ? (
              // Patient Specific Form fields
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Age</label>
                    <input
                      type="number"
                      required
                      placeholder="Enter age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="input-field"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">Mobile Number</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Current City</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter city"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Annual Income Bracket</label>
                    <select
                      value={incomeRange}
                      onChange={(e) => setIncomeRange(e.target.value)}
                      className="input-field"
                    >
                      <option value="low">Low Income Range (Cashless Schemes Eligible)</option>
                      <option value="middle">Middle Range (Govt Scheme discount)</option>
                      <option value="high">High Range (Private premium billing)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">ABHA Health ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter 14-digit ABHA ID"
                      value={abhaId}
                      onChange={(e) => setAbhaId(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Insurance Cards / Coverages</label>
                    <input
                      type="text"
                      placeholder="Enter insurance cards/schemes"
                      value={insuranceDetails}
                      onChange={(e) => setInsuranceDetails(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Describe health problem / symptomatology</label>
                  <textarea
                    rows="2"
                    placeholder="Describe your health complaint or symptoms..."
                    value={healthProblem}
                    onChange={(e) => setHealthProblem(e.target.value)}
                    className="input-field"
                  ></textarea>
                </div>
              </div>
            ) : (
              // Hospital Specific Form fields
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Hospital Institution Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter hospital name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">City</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter city"
                      value={hCity}
                      onChange={(e) => setHCity(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Full Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full address"
                    value={hAddress}
                    onChange={(e) => setHAddress(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">Minimum Fee (₹)</label>
                    <input
                      type="number"
                      required
                      value={hMinPrice}
                      onChange={(e) => setHMinPrice(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Maximum Fee (₹)</label>
                    <input
                      type="number"
                      required
                      value={hMaxPrice}
                      onChange={(e) => setHMaxPrice(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="input-label">Emergency Service (24/7)</label>
                    <select
                      value={hEmergency}
                      onChange={(e) => setHEmergency(e.target.value === 'true')}
                      className="input-field"
                    >
                      <option value="true">Active Emergency Support</option>
                      <option value="false">No ICU/Emergency Ward</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">Departments (Separated by commas)</label>
                  <input
                    type="text"
                    value={hDepts}
                    onChange={(e) => setHDepts(e.target.value)}
                    placeholder="Enter departments separated by commas"
                    className="input-field"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-semibold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating account profile...
                </>
              ) : (
                'Complete Account Registration'
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="text-clinic-600 hover:text-clinic-700 font-semibold underline">
            Login here &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
