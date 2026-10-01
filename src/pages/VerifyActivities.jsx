import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ActivityRow from '../components/ActivityRow.jsx';

export default function VerifyActivities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewIdParam = searchParams.get('reviewId');

  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Review screen state
  const [activeReviewItem, setActiveReviewItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved'); // 'Approved' | 'Rejected'
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await verificationService.getPendingActivities();
      if (response && response.success) {
        const list = response.data || [];
        setPendingActivities(list);

        if (reviewIdParam) {
          const matched = list.find((a) => a._id === reviewIdParam);
          if (matched) {
            openReview(matched);
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch verification queue');
    } finally {
      setLoading(false);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  const formatDateFull = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const openReview = (activity) => {
    setActiveReviewItem(activity);
    setReviewAction('Approved');
    setRemarks('Verified against institutional activity guidelines.');
    setRemarksError('');
  };

  const closeReview = () => {
    setActiveReviewItem(null);
    setRemarks('');
    setRemarksError('');
    if (reviewIdParam) {
      searchParams.delete('reviewId');
      setSearchParams(searchParams);
    }
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    setRemarksError('');

    if (reviewAction === 'Rejected' && !remarks.trim()) {
      setRemarksError('Remarks are mandatory when rejecting a submission.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await verificationService.verifyActivity(
        activeReviewItem._id,
        reviewAction,
        remarks.trim()
      );

      if (response && response.success) {
        setPendingActivities((prev) =>
          prev.filter((item) => item._id !== activeReviewItem._id)
        );
        setSuccessBanner(
          `Record "${activeReviewItem.activityTitle || activeReviewItem.title}" was marked ${reviewAction.toUpperCase()}.`
        );
        closeReview();
      }
    } catch (err) {
      setRemarksError(err.message || 'Failed to record decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredQueue = pendingActivities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const title = (act.activityTitle || act.title || '').toLowerCase();
    const student = (act.studentId?.name || act.studentName || '').toLowerCase();
    const dept = (act.studentId?.department || act.department || '').toLowerCase();
    return title.includes(q) || student.includes(q) || dept.includes(q);
  });

  if (loading) {
    return <LoadingSpinner message="Accessing verification queue..." />;
  }

  // ==========================================================
  // REVIEW DOCKET VIEW
  // ==========================================================
  if (activeReviewItem) {
    const studentName =
      activeReviewItem.studentId?.name || activeReviewItem.studentName || 'Student Candidate';
    const department =
      activeReviewItem.studentId?.department || activeReviewItem.department || 'Computer Science & Engineering';
    const title = activeReviewItem.activityTitle || activeReviewItem.title || 'Untitled Activity';
    const category = activeReviewItem.activityCategory || activeReviewItem.category || 'Activity';
    const dateStr = formatDateFull(activeReviewItem.activityDate);
    const organizer = activeReviewItem.organizer || 'College Department';
    const eventName = activeReviewItem.eventName || 'Institutional Event';

    return (
      <div className="w-full max-w-4xl space-y-8 sm:space-y-10 select-text">
        {/* Back Navigation */}
        <div className="border-b border-[#D2D2D7] pb-[12px]">
          <button
            id="btn-back-to-queue"
            onClick={closeReview}
            className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
          >
            ← Back to Review Queue
          </button>
        </div>

        {/* Title */}
        <section className="space-y-[8px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] leading-tight tracking-tight break-words">
            Record Verification
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73]">
            Evaluate candidate evidence against institutional guidelines.
          </p>
        </section>

        {/* 01 — CANDIDATE */}
        <section className="space-y-[16px]">
          <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
            <span className="text-[28px] font-[600] text-[#0066CC] font-mono leading-none">
              01
            </span>
            <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
              CANDIDATE PARTICULARS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] bg-[#FFFFFF] p-[20px] rounded-[18px] border border-[#D2D2D7]/60">
            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Name
              </div>
              <div className="text-[17px] font-[600] text-[#1D1D1F] mt-[4px]">
                {studentName}
              </div>
            </div>
            <div>
              <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                Department
              </div>
              <div className="text-[17px] font-[400] text-[#1D1D1F] mt-[4px]">
                {department}
              </div>
            </div>
          </div>
        </section>

        {/* 02 — ACTIVITY RECORD */}
        <section className="space-y-[16px]">
          <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
            <span className="text-[28px] font-[600] text-[#FF791B] font-mono leading-none">
              02
            </span>
            <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
              ACTIVITY RECORD
            </h2>
          </div>

          <div className="space-y-[16px] bg-[#FFFFFF] p-[20px] rounded-[18px] border border-[#D2D2D7]/60">
            <div>
              <span className="text-[14px] font-[600] text-[#0066CC]">{category}</span>
              <div className="text-[28px] font-[600] text-[#1D1D1F] mt-[4px] leading-tight">
                {title}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] pt-[8px] border-t border-[#D2D2D7]/60">
              <div>
                <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                  Event
                </div>
                <div className="text-[14px] font-[400] text-[#1D1D1F] mt-[4px]">
                  {eventName}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                  Organizer
                </div>
                <div className="text-[14px] font-[400] text-[#1D1D1F] mt-[4px]">
                  {organizer}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                  Date
                </div>
                <div className="text-[14px] font-[400] text-[#1D1D1F] mt-[4px]">
                  {dateStr}
                </div>
              </div>
            </div>

            {activeReviewItem.description && (
              <div className="pt-[12px] border-t border-[#D2D2D7]/60">
                <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                  Student Notes
                </div>
                <div className="text-[14px] text-[#6E6E73] mt-[4px]">
                  {activeReviewItem.description}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 03 — OFFICIAL DECISION */}
        <section className="space-y-[16px]">
          <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
            <span className="text-[28px] font-[600] text-[#B64400] font-mono leading-none">
              03
            </span>
            <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
              OFFICIAL DECISION
            </h2>
          </div>

          <form id="verification-decision-form" onSubmit={handleDecisionSubmit} className="space-y-[20px]">
            {/* Verdict Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              <button
                type="button"
                id="btn-select-approve"
                onClick={() => {
                  setReviewAction('Approved');
                  if (!remarks || remarks === 'Rejected due to insufficient documentation.') {
                    setRemarks('Verified against institutional activity guidelines.');
                  }
                }}
                className={`p-[20px] rounded-[18px] text-left transition-all cursor-pointer ${
                  reviewAction === 'Approved'
                    ? 'bg-[#FFFFFF] border-2 border-[#0066CC] shadow-[2px_4px_12px_rgba(0,0,0,0.08)]'
                    : 'bg-[#FFFFFF] border border-[#D2D2D7] text-[#6E6E73] hover:border-[#1D1D1F]'
                }`}
              >
                <div className="text-[12px] font-[600] text-[#0066CC] uppercase tracking-wider">
                  Option 01
                </div>
                <div className="text-[17px] font-[600] text-[#1D1D1F] mt-[4px]">
                  Approve Record
                </div>
                <div className="text-[12px] text-[#6E6E73] mt-[4px]">
                  Accredit and enter into student's official transcript.
                </div>
              </button>

              <button
                type="button"
                id="btn-select-reject"
                onClick={() => {
                  setReviewAction('Rejected');
                  if (remarks === 'Verified against institutional activity guidelines.') {
                    setRemarks('');
                  }
                }}
                className={`p-[20px] rounded-[18px] text-left transition-all cursor-pointer ${
                  reviewAction === 'Rejected'
                    ? 'bg-[#FFFFFF] border-2 border-[#B64400] shadow-[2px_4px_12px_rgba(0,0,0,0.08)]'
                    : 'bg-[#FFFFFF] border border-[#D2D2D7] text-[#6E6E73] hover:border-[#1D1D1F]'
                }`}
              >
                <div className="text-[12px] font-[600] text-[#B64400] uppercase tracking-wider">
                  Option 02
                </div>
                <div className="text-[17px] font-[600] text-[#1D1D1F] mt-[4px]">
                  Reject Record
                </div>
                <div className="text-[12px] text-[#6E6E73] mt-[4px]">
                  Return to student with evaluation remarks.
                </div>
              </button>
            </div>

            {/* Remarks */}
            <div className="space-y-[6px]">
              <label
                htmlFor="verification-remarks"
                className="block text-[14px] font-[600] text-[#1D1D1F]"
              >
                Accreditation Remarks {reviewAction === 'Rejected' && '*'}
              </label>
              <textarea
                id="verification-remarks"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter verification feedback..."
                className="apple-input resize-none"
              />
              {remarksError && (
                <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{remarksError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-[16px] border-t border-[#D2D2D7] flex items-center justify-between">
              <button
                type="button"
                onClick={closeReview}
                className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-save-decision"
                type="submit"
                disabled={isProcessing}
                className="px-[28px] py-[10px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[17px] font-[600] rounded-[56px] transition-colors disabled:opacity-50 cursor-pointer shadow-[2px_4px_12px_rgba(0,0,0,0.08)]"
              >
                {isProcessing ? 'Saving...' : 'Confirm Decision'}
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  }

  // ==========================================================
  // QUEUE LIST VIEW
  // ==========================================================
  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {successBanner && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#0066CC] text-[#0066CC] rounded-[18px]">
          {successBanner}
        </div>
      )}
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D2D2D7]">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            Verification Queue
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73] mt-[4px]">
            Submissions pending faculty evaluation.
          </p>
        </div>

        <div className="text-[14px] font-[600] text-[#6E6E73]">
          {pad(pendingActivities.length)} Pending Reviews
        </div>
      </section>

      {/* Search Input */}
      <section className="space-y-[6px]">
        <label
          htmlFor="input-search-queue"
          className="block text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider"
        >
          SEARCH QUEUE
        </label>
        <input
          id="input-search-queue"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by student candidate, department, or activity title..."
          className="apple-input"
        />
      </section>

      {/* Queue List */}
      <section>
        {filteredQueue.length === 0 ? (
          <div className="py-[62px] text-center bg-[#FFFFFF] rounded-[18px] border border-[#D2D2D7]/60">
            <p className="text-[14px] text-[#6E6E73]">
              No submissions awaiting review.
            </p>
          </div>
        ) : (
          <div>
            {filteredQueue.map((item, index) => (
              <ActivityRow
                key={item._id}
                activity={item}
                index={index}
                linkTo={`/admin/verification?reviewId=${item._id}`}
                isStudent={false}
                onReview={() => openReview(item)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
