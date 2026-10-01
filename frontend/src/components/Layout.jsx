import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col selection:bg-[#0066CC] selection:text-[#FFFFFF]">
      {/* Top Application Bar with exact 2-row contract */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
