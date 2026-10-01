import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', label: 'Overview', id: 'sidebar-link-student-dashboard' },
    { to: '/student/activities', label: 'Activities', id: 'sidebar-link-my-activities' },
    { to: '/student/activities/new', label: 'Add Activity', id: 'sidebar-link-add-activity' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', id: 'sidebar-link-admin-dashboard' },
    { to: '/admin/verification', label: 'Review Queue', id: 'sidebar-link-verify-activities' },
    { to: '/admin/activities', label: 'Archive', id: 'sidebar-link-all-activities' },
    { to: '/admin/reports', label: 'Reports', id: 'sidebar-link-admin-reports' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  if (!isOpen) return null;

  return (
    <>
      <div
        id="sidebar-mobile-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-[#1D1D1F]/30 backdrop-blur-xs md:hidden"
      />
      <aside
        id="portal-sidebar"
        className="fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[80vw] bg-[#FFFFFF] border-r border-[#D2D2D7] p-5 flex flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-[20px]">
          <div className="text-[17px] font-[600] text-[#1D1D1F]">
            Student Activity Portal
          </div>
          <nav className="space-y-[8px]">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                id={link.id}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-[16px] py-[8px] rounded-[56px] text-[14px] transition-colors ${
                    isActive
                      ? 'bg-[#1D1D1F] text-[#FFFFFF] font-[600]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
