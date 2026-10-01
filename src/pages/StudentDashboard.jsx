import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import activityService from '../services/activityService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ActivityRow from '../components/ActivityRow.jsx';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await activityService.getActivities();
      if (response && response.success) {
        const rawActivities = Array.isArray(response.data)
          ? response.data
          : (response.data?.activities || response.activities || []);
        setActivities(rawActivities);
      }
    } catch (err) {
      setError(err.message || 'Failed to load activity records');
    } finally {
      setLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  const totalActivities = activities.length;
  const approvedCount = activities.filter((a) => a.verificationStatus === 'Approved').length;
  const pendingCount = activities.filter((a) => a.verificationStatus === 'Pending').length;
  const rejectedCount = activities.filter((a) => a.verificationStatus === 'Rejected').length;

  const recentActivities = activities.slice(0, 6);

  if (loading) {
    return <LoadingSpinner message="Loading activity records..." />;
  }

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* ==========================================================
          PAGE HEADER
          Dashboard
          Aarav Patel
          Computer Science & Engineering
          STU-2026-101
          ========================================================== */}
      <section id="student-header" className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
          Dashboard
        </h1>
        <div className="space-y-[2px] text-[14px] font-[400] text-[#6E6E73]">
          <div className="text-[17px] font-[600] text-[#1D1D1F]">
            {user?.name || 'Aarav Patel'}
          </div>
          <div>
            {user?.department || 'Computer Science & Engineering'}
          </div>
          <div className="font-mono text-[12px]">
            {user?.userId || 'STU-2026-101'}
          </div>
        </div>
      </section>

      {/* ==========================================================
          LARGE SUMMARY SURFACE
          Inside ONE 18px-radius surface:
          02 Activities | 01 Approved | 01 Pending | 00 Rejected
          Arranged horizontally on desktop with generous spacing
          Vertical separators
          Numbers visually dominate labels
          ========================================================== */}
      <section id="record-summary" className="w-full">
        <div className="bg-[#FFFFFF] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 p-6 sm:p-8 lg:p-10 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 items-center w-full">
            {/* 01: Activities */}
            <div className="flex flex-col items-center lg:items-start lg:pr-6 xl:pr-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#1D1D1F] leading-none font-mono break-words">
                {pad(totalActivities)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Activities
              </div>
            </div>

            {/* 02: Approved */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#0066CC] leading-none font-mono break-words">
                {pad(approvedCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Approved
              </div>
            </div>

            {/* 03: Pending */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#FF791B] leading-none font-mono break-words">
                {pad(pendingCount)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Pending
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

      {/* ==========================================================
          THE IMPORTANT PART: RECENT ACTIVITIES
          Apple-style list with 40px vertical breathing room,
          thin separators, 0.3s hover transition with 4px arrow shift.
          ========================================================== */}
      <section id="recent-records" className="space-y-4 pt-2.5 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#D2D2D7]">
          <h2 className="text-2xl sm:text-3xl font-[600] text-[#1D1D1F] tracking-tight">
            Recent Activities
          </h2>
          <Link
            id="link-view-all-records"
            to="/student/activities"
            className="text-[14px] font-[600] text-[#0066CC] hover:text-[#0066CC]/80 transition-colors"
          >
            View All ({pad(activities.length)}) →
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <div className="py-[62px] text-center bg-[#FFFFFF] rounded-[18px] border border-[#D2D2D7]/60">
            <p className="text-[14px] text-[#6E6E73]">
              No activities recorded yet.
            </p>
            <Link
              to="/student/activities/new"
              className="inline-block mt-[16px] px-[28px] py-[10px] bg-[#0066CC] text-[#FFFFFF] text-[14px] font-[600] rounded-[56px] hover:bg-[#0066CC]/90 transition-colors"
            >
              Add First Activity
            </Link>
          </div>
        ) : (
          <div>
            {recentActivities.map((act, index) => (
              <ActivityRow
                key={act._id}
                activity={act}
                index={index}
                linkTo={`/student/activities/${act._id}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
