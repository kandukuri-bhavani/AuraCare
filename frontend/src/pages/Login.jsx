import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      
      if (res.success) {
        // Route dashboard depending on role
        const role = res.user.role;
        if (role === 'patient') navigate('/');
        else if (role === 'doctor') navigate('/dashboard/doctor');
        else if (role === 'hospital') navigate('/dashboard/hospital');
        else navigate('/');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Server connection lost. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative design elements */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-clinic-50/50 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-emerald-50/30 blur-3xl -z-10"></div>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
        
        {/* Branding header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-clinic-50 border border-clinic-100 text-clinic-600 rounded-2xl flex items-center justify-center">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in to access medical lockers, doctor queues, and bookings.
          </p>
        </div>

        {/* Error warnings */}
        {(error || authError) && (
          <div className="bg-emergency-50 border border-emergency-100 p-3.5 rounded-2xl flex items-start gap-2.5 text-emergency-700 text-xs text-left animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0 text-emergency-500" />
            <div>
              <span className="font-bold">Authentication failed: </span>
              {error || authError}
            </div>
          </div>
        )}

        {/* Login form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Address */}
            <div className="text-left">
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. rohan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="text-left">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating session...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Signup redirection links */}
        <div className="text-center pt-2 text-xs text-slate-500">
          New to AuraCare?{' '}
          <Link to="/register" className="text-clinic-600 hover:text-clinic-700 font-semibold underline">
            Create an account &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
