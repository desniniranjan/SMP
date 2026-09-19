import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  CheckCheck,
  ShieldAlert,
  BarChart3,
  LogOut,
  User,
  School,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    {
      to: '/student/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      id: 'sidebar-link-student-dashboard',
    },
    {
      to: '/student/activities/new',
      label: 'Add Activity',
      icon: PlusCircle,
      id: 'sidebar-link-add-activity',
    },
    {
      to: '/student/activities',
      label: 'My Activities',
      icon: FolderKanban,
      id: 'sidebar-link-my-activities',
    },
    {
      to: '/student/approved',
      label: 'Approved Records',
      icon: CheckCheck,
      id: 'sidebar-link-student-approved',
    },
  ];

  const adminLinks = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      id: 'sidebar-link-admin-dashboard',
    },
    {
      to: '/admin/activities',
      label: 'All Activities',
      icon: FolderKanban,
      id: 'sidebar-link-all-activities',
    },
    {
      to: '/admin/verification',
      label: 'Verify Activities',
      icon: ShieldAlert,
      id: 'sidebar-link-verify-activities',
    },
    {
      to: '/admin/reports',
      label: 'Department Reports',
      icon: BarChart3,
      id: 'sidebar-link-admin-reports',
    },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="portal-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* User profile card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
                user?.role === 'admin' ? 'bg-indigo-700' : 'bg-emerald-600'
              }`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 truncate font-mono">
                {user?.userId || ''}
              </p>
              <div className="mt-0.5">
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                    user?.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {user?.role === 'admin' ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              {user?.role === 'admin' ? 'Administration Menu' : 'Student Portal Menu'}
            </p>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    id={link.id}
                    to={link.to}
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          {user?.department && (
            <div className="px-3 py-2 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start gap-2">
              <School className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Department</p>
                <p className="font-medium text-slate-700 truncate">{user.department}</p>
              </div>
            </div>
          )}

          <button
            id="btn-sidebar-logout"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
