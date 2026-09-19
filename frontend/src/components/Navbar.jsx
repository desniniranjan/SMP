import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, LogOut, User, ShieldCheck, Menu } from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      id="portal-top-navbar"
      className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onToggleSidebar && (
              <button
                id="btn-sidebar-toggle"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link
              to={
                !isAuthenticated
                  ? '/'
                  : user?.role === 'admin'
                  ? '/admin/dashboard'
                  : '/student/dashboard'
              }
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  Student Activity Record Portal
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Engineering College Centralized Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Auth State & Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* User Info Chip */}
                <div
                  id="user-profile-badge"
                  className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      user.role === 'admin' ? 'bg-indigo-700' : 'bg-emerald-600'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded uppercase font-semibold text-[10px] tracking-wide ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.department && (
                        <span className="truncate max-w-[140px] text-slate-500">
                          • {user.department}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  id="btn-logout-nav"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  title="Logout from portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  id="nav-link-login"
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  id="nav-link-register"
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
