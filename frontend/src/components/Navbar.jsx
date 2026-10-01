import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Top Navigation Component
 * Exact Specification:
 * ------------------------------------------------
 * Student Activity Portal                         Aarav Patel
 *
 * Overview     Activities     Add Activity
 * ------------------------------------------------
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentNav = [
    { to: '/student/dashboard', label: 'Overview', id: 'nav-student-overview' },
    { to: '/student/activities', label: 'Activities', id: 'nav-student-activities' },
    { to: '/student/activities/new', label: 'Add Activity', id: 'nav-student-add' },
  ];

  const adminNav = [
    { to: '/admin/dashboard', label: 'Overview', id: 'nav-admin-overview' },
    { to: '/admin/verification', label: 'Review Queue', id: 'nav-admin-queue' },
    { to: '/admin/activities', label: 'Archive', id: 'nav-admin-archive' },
    { to: '/admin/reports', label: 'Reports', id: 'nav-admin-reports' },
  ];

  const publicNav = [
    { to: '/', label: 'Overview', id: 'nav-public-home' },
    { to: '/student/approved', label: 'Activities', id: 'nav-public-activities' },
  ];

  const navLinks = !isAuthenticated
    ? publicNav
    : user?.role === 'admin'
    ? adminNav
    : studentNav;

  const defaultHomeLink = !isAuthenticated
    ? '/'
    : user?.role === 'admin'
    ? '/admin/dashboard'
    : '/student/dashboard';

  return (
    <header
      id="portal-top-navbar"
      className="w-full bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#D2D2D7] sticky top-0 z-30 select-none"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand & User Identity */}
        <div className="flex items-center justify-between min-h-[46px] sm:min-h-[58px] py-1 border-b border-[#D2D2D7]/60 gap-4">
          <Link
            to={defaultHomeLink}
            className="text-[17px] sm:text-[18px] font-[600] text-[#1D1D1F] hover:text-[#0066CC] transition-colors tracking-tight shrink-0"
          >
            Student Activity Portal
          </Link>

          <div className="flex items-center gap-[16px] shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-[12px]">
                <span className="text-[14px] font-[600] text-[#1D1D1F]">
                  {user.name || 'Aarav Patel'}
                </span>
                <span className="text-[#D2D2D7]" aria-hidden="true">·</span>
                <button
                  id="btn-nav-logout"
                  onClick={handleLogout}
                  className="text-[12px] font-[400] text-[#6E6E73] hover:text-[#B64400] transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-[16px] text-[14px]">
                <Link
                  to="/login"
                  className="text-[#6E6E73] hover:text-[#1D1D1F] font-[400] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-[#0066CC] hover:text-[#0066CC]/80 font-[600] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Navigation Links */}
        <nav className="flex items-center gap-6 sm:gap-8 min-h-[40px] sm:min-h-[46px] overflow-x-auto no-scrollbar py-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              id={item.id}
              className={({ isActive }) =>
                `text-[14px] transition-colors whitespace-nowrap py-[6px] ${
                  isActive
                    ? 'text-[#0066CC] font-[600] border-b-2 border-[#0066CC]'
                    : 'text-[#6E6E73] font-[400] hover:text-[#1D1D1F]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
