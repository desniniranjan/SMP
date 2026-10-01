import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ActivityRow from '../components/ActivityRow.jsx';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [portalRes, pendingRes] = await Promise.all([
        verificationService.getPortalSummary(),
        verificationService.getPendingActivities(),
      ]);

      if (portalRes && portalRes.success) {
        setSummary(portalRes.data);
      }
      if (pendingRes && pendingRes.success) {
        setPendingActivities(pendingRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load records office data');
    } finally {
      setLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  if (loading) {
    return <LoadingSpinner message="Accessing records office..." />;
  }

  const pendingCount = summary?.pendingVerification ?? pendingActivities.length;
  const totalCount = summary?.totalActivities ?? 0;
  const approvedCount = summary?.approvedActivities ?? 0;
  const rejectedCount = summary?.rejectedActivities ?? 0;

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
          Records Office
        </h1>
        <p className="text-[17px] font-[400] text-[#6E6E73]">
          Central activity verification and institutional accreditation ledger.
        </p>
      </section>

      {/* Large Summary Surface */}
      <section id="admin-summary" className="w-full">
        <div className="bg-[#FFFFFF] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 p-6 sm:p-8 lg:p-10 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 items-center w-full">
            {/* 01: Total */}
            <div className="flex flex-col items-center lg:items-start lg:pr-6 xl:pr-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#1D1D1F] leading-none font-mono break-words">
                {pad(totalCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Total Records
              </div>
            </div>

            {/* 02: Pending Review */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#FF791B] leading-none font-mono break-words">
                {pad(pendingCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Pending Review
              </div>
            </div>

            {/* 03: Approved */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#0066CC] leading-none font-mono break-words">
                {pad(approvedCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Approved
              </div>
            </div>

            {/* 04: Rejected */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:pl-6 xl:pl-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#B64400] leading-none font-mono break-words">
                {pad(rejectedCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Rejected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Queue Section */}
      <section className="space-y-4 pt-2.5 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#D2D2D7]">
          <h2 className="text-2xl sm:text-3xl font-[600] text-[#1D1D1F] tracking-tight">
            Pending Submissions
          </h2>
          <Link
            id="link-view-all-queue"
            to="/admin/verification"
            className="text-[14px] font-[600] text-[#0066CC] hover:text-[#0066CC]/80 transition-colors"
          >
            Review Queue ({pad(pendingActivities.length)}) →
          </Link>
        </div>

        {pendingActivities.length === 0 ? (
          <div className="py-[62px] text-center bg-[#FFFFFF] rounded-[18px] border border-[#D2D2D7]/60">
            <p className="text-[14px] text-[#6E6E73]">
              All submissions currently verified. No pending reviews.
            </p>
          </div>
        ) : (
          <div>
            {pendingActivities.slice(0, 6).map((item, index) => (
              <ActivityRow
                key={item._id}
                activity={item}
                index={index}
                linkTo={`/admin/verification?reviewId=${item._id}`}
                isStudent={false}
                onReview={() => navigate(`/admin/verification?reviewId=${item._id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
