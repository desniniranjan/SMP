import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
      setError('Please provide email address and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login(formData.email.trim(), formData.password);

      if (response && response.success) {
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (email, pass) => {
    setFormData({ email, password: pass });
    setError('');
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-start sm:justify-center py-6 sm:py-10 select-text">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-7 px-1">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            Sign In
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73]">
            Access the Student Activity Record Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] p-[28px] sm:p-[38px] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 space-y-[20px]">
          {location.state?.message && !error && (
            <div className="p-[12px] bg-[#FFFFFF] text-[#0066CC] text-[14px] rounded-[18px] border border-[#0066CC]/30 font-[400]">
              {location.state.message}
            </div>
          )}

          {error && (
            <div
              id="login-error-alert"
              className="p-[12px] bg-[#FFFFFF] text-[#B64400] text-[14px] rounded-[18px] border border-[#B64400]/40 font-[400]"
            >
              {error}
            </div>
          )}

          <form id="portal-login-form" onSubmit={handleSubmit} className="space-y-[18px]">
            <div className="space-y-[6px]">
              <label
                htmlFor="email"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Institutional Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav.cse@college.edu"
                className="apple-input"
                required
              />
            </div>

            <div className="space-y-[6px]">
              <label
                htmlFor="password"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="apple-input"
                required
              />
            </div>

            <button
              id="btn-sign-in"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[10px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[17px] font-[600] rounded-[56px] transition-colors disabled:opacity-50 cursor-pointer shadow-[2px_4px_12px_rgba(0,0,0,0.08)] mt-[8px]"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials Switcher */}
          <div className="pt-[16px] border-t border-[#D2D2D7] space-y-[10px]">
            <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
              Demo Access
            </div>
            <div className="flex flex-wrap items-center gap-[8px]">
              <button
                type="button"
                id="btn-demo-student"
                onClick={() => handleFillDemo('aarav.cse@college.edu', 'Password@123')}
                className="px-[16px] py-[6px] rounded-[56px] bg-[#F5F5F7] hover:bg-[#D2D2D7] text-[#0066CC] text-[12px] font-[600] transition-colors cursor-pointer"
              >
                Student (aarav.cse@college.edu)
              </button>
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleFillDemo('admin@college.edu', 'Admin@123')}
                className="px-[16px] py-[6px] rounded-[56px] bg-[#F5F5F7] hover:bg-[#D2D2D7] text-[#0066CC] text-[12px] font-[600] transition-colors cursor-pointer"
              >
                Records Office (admin@college.edu)
              </button>
            </div>
            <div className="text-[12px] text-[#6E6E73] space-y-[2px]">
              <div>
                Student:{' '}
                <span className="font-mono text-[#1D1D1F] font-[600]">aarav.cse@college.edu</span> /{' '}
                <span className="font-mono text-[#1D1D1F]">Password@123</span>
              </div>
              <div>
                Records Office:{' '}
                <span className="font-mono text-[#1D1D1F] font-[600]">admin@college.edu</span> /{' '}
                <span className="font-mono text-[#1D1D1F]">Admin@123</span>
              </div>
            </div>
          </div>

          <div className="pt-[4px] text-center text-[14px] text-[#6E6E73]">
            Need candidate enrollment?{' '}
            <Link to="/register" className="text-[#0066CC] font-[600] hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
