import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

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
      newErrors.name = 'Student full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'College email address is required';
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your engineering department';
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
      // STRICT REQUIREMENT: public registration never sends role, backend forces student
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        department: formData.department,
      });

      if (response.success) {
        setSuccessMsg('Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login', {
            state: { registeredEmail: formData.email, message: 'Account created! Please sign in.' },
          });
        }, 1500);
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-sm">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Portal Registration
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Create your account to record and verify academic achievements
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-slate-200">
          {serverError && (
            <div
              id="register-error-alert"
              className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMsg && (
            <div
              id="register-success-alert"
              className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form id="student-registration-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Patel"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                College / Personal Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@college.edu"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Department *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.department}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password (min 6 characters) *
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
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Registration Notice */}
            <p className="text-xs text-slate-500 italic">
              Note: All public accounts are registered as verified students under their selected department.
            </p>

            {/* Submit Button */}
            <button
              id="btn-register-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link
                id="link-to-login"
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
