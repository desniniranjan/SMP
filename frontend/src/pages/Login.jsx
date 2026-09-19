import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Mail,
  Lock,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter both your email address and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(formData.email.trim(), formData.password);

      if (response.success) {
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(
        err.message ||
          'Invalid credentials. Please verify your email and password or use the demo credentials below.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-sm">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Portal Sign In
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Student Activity Record Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-slate-200">
          {location.state?.message && !error && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              {location.state.message}
            </div>
          )}

          {error && (
            <div
              id="login-error-alert"
              className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form id="portal-login-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@college.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                id="btn-demo-student"
                onClick={() => handleDemoFill('aarav.cse@college.edu', 'Password@123')}
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Student Demo</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">aarav.cse@college.edu</p>
              </button>

              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleDemoFill('admin@college.edu', 'Admin@123')}
                className="p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Demo</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">admin@college.edu</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              New student?{' '}
              <Link
                id="link-to-register"
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
