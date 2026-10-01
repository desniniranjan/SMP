import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import activityService from '../services/activityService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await activityService.getActivity(id);
      if (response && response.success) {
        setActivity(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve record');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving record..." />;
  }

  if (error || !activity) {
    return (
      <div className="py-[62px] text-center space-y-[16px]">
        <h2 className="text-[28px] font-[600] text-[#1D1D1F]">Record Not Found</h2>
        <p className="text-[14px] text-[#6E6E73]">{error || 'This activity record does not exist.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-[14px] text-[#0066CC] font-[600] hover:underline cursor-pointer"
        >
          ← Return to Activities
        </button>
      </div>
    );
  }

  const isOwner =
    user?.role === 'student' &&
    (activity.studentId?._id === user?._id || activity.studentId === user?._id);

  const formatDateWords = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const activityTitle = activity.title || activity.activityTitle || 'Untitled Record';
  const category = activity.category || activity.activityCategory || 'Activity';
  const eventName = activity.eventName || '—';
  const organizer = activity.organizer || '—';
  const activityDateStr = formatDateWords(activity.activityDate);

  const verificationStatus = activity.verificationStatus || 'Pending';
  const verifiedDateStr = activity.verification?.verificationDate
    ? formatDateWords(activity.verification.verificationDate)
    : activity.verifiedAt
    ? formatDateWords(activity.verifiedAt)
    : '—';
  const remarks =
    activity.verification?.remarks ||
    activity.verificationRemarks ||
    'No evaluation remarks recorded.';

  return (
    <div className="w-full max-w-4xl space-y-8 sm:space-y-10 select-text">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between border-b border-[#D2D2D7] pb-[12px]">
        <button
          id="btn-back-from-details"
          onClick={() => navigate(-1)}
          className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          ← Back
        </button>

        {isOwner && (
          <Link
            id="btn-edit-record"
            to={`/student/activities/edit/${activity._id}`}
            className="text-[14px] font-[600] text-[#0066CC] hover:underline"
          >
            Edit Record →
          </Link>
        )}
      </div>

      {/* Main Details Surface */}
      <div className="bg-[#FFFFFF] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-7">
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#D2D2D7]">
          <div className="space-y-[6px] min-w-0 flex-1">
            <span className="text-[14px] font-[600] text-[#0066CC]">
              {category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-[600] text-[#1D1D1F] leading-tight break-words">
              {activityTitle}
            </h1>
            <p className="text-[14px] text-[#6E6E73]">
              {activityDateStr}
            </p>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            <StatusBadge status={verificationStatus} />
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: Event & Organization */}
          <div className="space-y-[18px]">
            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Event Name
              </div>
              <div className="text-[17px] font-[400] text-[#1D1D1F] mt-[4px]">
                {eventName}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Organizer
              </div>
              <div className="text-[17px] font-[400] text-[#1D1D1F] mt-[4px]">
                {organizer}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Certificate Status
              </div>
              <div className="mt-[6px]">
                <StatusBadge status={activity.certificateStatus || 'Pending'} type="certificate" />
              </div>
            </div>
          </div>

          {/* Column 2: Candidate & Verification */}
          <div className="space-y-[18px]">
            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Candidate
              </div>
              <div className="text-[17px] font-[600] text-[#1D1D1F] mt-[4px]">
                {activity.studentId?.name || activity.studentName || user?.name || 'Aarav Patel'}
              </div>
              <div className="text-[14px] font-[400] text-[#6E6E73]">
                {activity.studentId?.department || activity.department || user?.department || 'Computer Science & Engineering'}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Verification Details
              </div>
              <div className="text-[14px] font-[400] text-[#1D1D1F] mt-[4px]">
                Status: <span className="font-[600]">{verificationStatus}</span>
              </div>
              {verifiedDateStr !== '—' && (
                <div className="text-[12px] text-[#6E6E73]">
                  Date: {verifiedDateStr}
                </div>
              )}
            </div>

            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Evaluation Remarks
              </div>
              <div className="text-[14px] font-[400] text-[#1D1D1F] mt-[4px] p-[12px] bg-[#F5F5F7] rounded-[18px] border border-[#D2D2D7]/60">
                {remarks}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        {activity.description && (
          <div className="pt-[20px] border-t border-[#D2D2D7] space-y-[6px]">
            <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
              Notes
            </div>
            <div className="text-[14px] font-[400] text-[#6E6E73] whitespace-pre-wrap leading-relaxed">
              {activity.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
