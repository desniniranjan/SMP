import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 characters required';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        department: formData.department,
      });

      if (response && response.success) {
        setSuccessMsg('Account registered successfully. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/login', {
            state: { registeredEmail: formData.email, message: 'Account registered. Sign in below.' },
          });
        }, 1000);
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-start sm:justify-center py-6 sm:py-10 select-text">
      <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-7 px-1">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            Register
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73]">
            Enroll your profile in the Student Activity Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] p-[28px] sm:p-[38px] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 space-y-[20px]">
          {successMsg && (
            <div className="p-[12px] bg-[#FFFFFF] text-[#0066CC] text-[14px] rounded-[18px] border border-[#0066CC]/30 font-[400]">
              {successMsg}
            </div>
          )}

          {serverError && (
            <div
              id="register-error-alert"
              className="p-[12px] bg-[#FFFFFF] text-[#B64400] text-[14px] rounded-[18px] border border-[#B64400]/40 font-[400]"
            >
              {serverError}
            </div>
          )}

          <form id="portal-register-form" onSubmit={handleSubmit} className="space-y-[18px]">
            <div className="space-y-[6px]">
              <label
                htmlFor="name"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Patel"
                className="apple-input"
                required
              />
              {errors.name && (
                <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.name}</p>
              )}
            </div>

            <div className="space-y-[6px]">
              <label
                htmlFor="email"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Institutional Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="candidate@college.edu"
                className="apple-input"
                required
              />
              {errors.email && (
                <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.email}</p>
              )}
            </div>

            <div className="space-y-[6px]">
              <label
                htmlFor="department"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="apple-input cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-[6px]">
              <label
                htmlFor="password"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Password *
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
              {errors.password && (
                <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.password}</p>
              )}
            </div>

            <div className="space-y-[6px]">
              <label
                htmlFor="confirmPassword"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="apple-input"
                required
              />
              {errors.confirmPassword && (
                <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              id="btn-register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[10px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[17px] font-[600] rounded-[56px] transition-colors disabled:opacity-50 cursor-pointer shadow-[2px_4px_12px_rgba(0,0,0,0.08)] mt-[8px]"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="pt-[16px] border-t border-[#D2D2D7] text-center text-[14px] text-[#6E6E73]">
            Already enrolled?{' '}
            <Link to="/login" className="text-[#0066CC] font-[600] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
