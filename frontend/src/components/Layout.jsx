import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Public pages that don't need the persistent left sidebar
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPage = publicPaths.includes(location.pathname);

  const showSidebar = isAuthenticated && !isPublicPage;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex-1 flex">
        {/* Role-based Sidebar */}
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-200 ${
            showSidebar ? 'lg:pl-64' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
