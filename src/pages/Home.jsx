import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="w-full space-y-10 md:space-y-12 py-4 sm:py-6 select-text">
      {/* Editorial Header Section */}
      <section className="space-y-4 md:space-y-5 w-full">
        <div className="text-[12px] sm:text-[13px] font-[600] text-[#0066CC] uppercase tracking-wider">
          Student Activity Portal
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-[600] text-[#1D1D1F] leading-[1.12] tracking-tight max-w-[720px] w-full break-words">
          Student Activity Record
        </h1>

        <p className="text-[16px] sm:text-[17px] text-[#6E6E73] font-[400] leading-relaxed max-w-[620px] w-full pt-1">
          A centralized portal for maintaining student academic and extracurricular activity records.
          Log achievements, track official faculty verifications, and generate institutional transcripts.
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
          {isAuthenticated ? (
            <Link
              id="btn-home-portal"
              to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
              className="px-7 py-3 bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[16px] font-[600] rounded-[56px] transition-colors shadow-[2px_4px_12px_rgba(0,0,0,0.08)]"
            >
              Enter {user?.role === 'admin' ? 'Records Office' : 'Dashboard'} →
            </Link>
          ) : (
            <>
              <Link
                id="btn-home-signin"
                to="/login"
                className="px-7 py-3 bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[16px] font-[600] rounded-[56px] transition-colors shadow-[2px_4px_12px_rgba(0,0,0,0.08)]"
              >
                Sign In →
              </Link>
              <Link
                id="btn-home-register"
                to="/register"
                className="px-7 py-3 bg-[#FFFFFF] border border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] text-[16px] font-[400] rounded-[56px] transition-colors"
              >
                Create Account
              </Link>
            </>
          )}

          <Link
            id="btn-home-approved"
            to="/student/approved"
            className="px-4 py-2 text-[#0066CC] hover:underline text-[14px] font-[600]"
          >
            Public Archive →
          </Link>
        </div>
      </section>

      {/* Feature Tripartite Surfaces */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 w-full pt-2">
        {/* 01 */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 lg:p-8 rounded-[18px] border border-[#D2D2D7]/60 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] space-y-3 flex flex-col justify-start">
          <div className="text-[28px] sm:text-[32px] font-[600] text-[#0066CC] font-mono leading-none">
            01
          </div>
          <h2 className="text-[17px] sm:text-[18px] font-[600] text-[#1D1D1F]">
            Activity Portfolio
          </h2>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            Record hackathons, workshops, certifications, and technical achievements with attached credentials.
          </p>
        </div>

        {/* 02 */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 lg:p-8 rounded-[18px] border border-[#D2D2D7]/60 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] space-y-3 flex flex-col justify-start">
          <div className="text-[28px] sm:text-[32px] font-[600] text-[#FF791B] font-mono leading-none">
            02
          </div>
          <h2 className="text-[17px] sm:text-[18px] font-[600] text-[#1D1D1F]">
            Official Verification
          </h2>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            Faculty and records officers evaluate submissions and issue verified institutional stamps and remarks.
          </p>
        </div>

        {/* 03 */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 lg:p-8 rounded-[18px] border border-[#D2D2D7]/60 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] space-y-3 flex flex-col justify-start">
          <div className="text-[28px] sm:text-[32px] font-[600] text-[#B64400] font-mono leading-none">
            03
          </div>
          <h2 className="text-[17px] sm:text-[18px] font-[600] text-[#1D1D1F]">
            Accreditation Audit
          </h2>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            Exportable departmental reports and statutory accreditation metrics ready for compliance audits.
          </p>
        </div>
      </section>
    </div>
  );
}
