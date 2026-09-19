import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import verificationService from '../services/verificationService.js';
import activityService from '../services/activityService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SearchBar from '../components/SearchBar.jsx';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Building2,
  Award,
  User,
  Check,
  X,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function VerifyActivities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reviewIdParam = searchParams.get('reviewId');

  const [pendingActivities, setPendingActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Review Modal state
  const [activeReviewItem, setActiveReviewItem] = useState(null);
  const [reviewAction, setReviewAction] = useState('Approved'); // 'Approved' | 'Rejected'
  const [remarks, setRemarks] = useState('');
  const [remarksError, setRemarksError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await verificationService.getPendingActivities();
      if (response.success) {
        const list = response.data || [];
        setPendingActivities(list);

        // Check if there was a URL reviewId
        if (reviewIdParam) {
          const matched = list.find((a) => a._id === reviewIdParam);
          if (matched) {
            openReviewModal(matched, 'Approved');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch pending activities for verification');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (activity, action = 'Approved') => {
    setActiveReviewItem(activity);
    setReviewAction(action);
    setRemarks(
      action === 'Approved'
        ? 'Verified against college activity guidelines and certificates.'
        : ''
    );
    setRemarksError('');
  };

  const closeReviewModal = () => {
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
      setRemarksError('Remarks are mandatory when rejecting an activity to provide constructive feedback.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await verificationService.verifyActivity(
        activeReviewItem._id,
        reviewAction,
        remarks.trim()
      );

      if (response.success) {
        // Immediate UI update without page refresh
        setPendingActivities((prev) =>
          prev.filter((item) => item._id !== activeReviewItem._id)
        );
        setSuccessBanner(
          `Activity "${activeReviewItem.activityTitle}" was successfully ${reviewAction.toLowerCase()}.`
        );
        closeReviewModal();
      }
    } catch (err) {
      setRemarksError(err.message || 'Failed to complete verification decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick One-Click Approval
  const handleQuickApprove = async (activity) => {
    setIsProcessing(true);
    try {
      const response = await verificationService.verifyActivity(
        activity._id,
        'Approved',
        'Quick-approved by department verification administrator.'
      );
      if (response.success) {
        setPendingActivities((prev) => prev.filter((item) => item._id !== activity._id));
        setSuccessBanner(`Activity "${activity.activityTitle}" approved.`);
      }
    } catch (err) {
      setError(err.message || 'Quick approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filtered pending activities
  const filteredList = pendingActivities.filter((act) => {
    if (categoryFilter !== 'All' && act.activityCategory !== categoryFilter) {
      return false;
    }
    if (
      departmentFilter !== 'All' &&
      act.studentId?.department !== departmentFilter
    ) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = act.activityTitle?.toLowerCase().includes(q);
      const matchEvent = act.eventName?.toLowerCase().includes(q);
      const matchStudent = act.studentId?.name?.toLowerCase().includes(q);
      const matchDept = act.studentId?.department?.toLowerCase().includes(q);
      const matchId = act.activityId?.toLowerCase().includes(q);
      return matchTitle || matchEvent || matchStudent || matchDept || matchId;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
              Admin Verification Workbench
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {pendingActivities.length} Pending Actions
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Activity Verification Queue
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Authenticate student achievements, certificates, and participation records.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div
          id="verify-success-alert"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold uppercase ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Component */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter="Pending"
        onStatusChange={() => {}}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        showDepartmentFilter={true}
        onResetFilters={() => {
          setSearchQuery('');
          setCategoryFilter('All');
          setDepartmentFilter('All');
        }}
        placeholder="Filter by student name, roll number, title, or department..."
      />

      {/* Table / List */}
      {loading ? (
        <LoadingSpinner message="Fetching pending verification submissions..." />
      ) : filteredList.length === 0 ? (
        <div
          id="empty-pending-state"
          className="bg-white rounded-xl border border-slate-200 p-12 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            All Caught Up!
          </h4>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            {pendingActivities.length === 0
              ? 'There are no student activities currently pending verification.'
              : 'No pending activities match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Student Information</th>
                  <th scope="col" className="px-5 py-3.5">Activity Record</th>
                  <th scope="col" className="px-4 py-3.5">Category</th>
                  <th scope="col" className="px-4 py-3.5">Date</th>
                  <th scope="col" className="px-4 py-3.5">Certificate</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                {filteredList.map((act) => {
                  const formattedDate = act.activityDate
                    ? new Date(act.activityDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr
                      key={act._id}
                      id={`verify-row-${act._id}`}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {act.studentId?.name || 'Unknown Student'}
                        </div>
                        <div className="text-xs text-indigo-700 font-medium">
                          {act.studentId?.department}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          ID: {act.studentId?.userId || act.studentId?.email}
                        </div>
                      </td>

                      {/* Activity Record */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 line-clamp-1">
                          {act.activityTitle}
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.eventName}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.organizer}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {act.activityCategory}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* Certificate */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={act.certificateStatus} type="certificate" />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`btn-approve-direct-${act._id}`}
                            onClick={() => openReviewModal(act, 'Approved')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                            title="Approve Activity"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            id={`btn-reject-direct-${act._id}`}
                            onClick={() => openReviewModal(act, 'Rejected')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            title="Reject Activity (remarks required)"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {activeReviewItem && (
        <div
          id="verification-review-modal"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Verification Evaluation
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Review Activity Record
                </h3>
              </div>
              <button
                onClick={closeReviewModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details of the Activity */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">
                  {activeReviewItem.studentId?.name} ({activeReviewItem.studentId?.department})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Activity Title:</span>
                <span className="font-semibold text-slate-800">{activeReviewItem.activityTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event & Organizer:</span>
                <span className="text-slate-700">
                  {activeReviewItem.eventName} • {activeReviewItem.organizer}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Certificate Status:</span>
                <StatusBadge status={activeReviewItem.certificateStatus} type="certificate" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleDecisionSubmit} className="space-y-4">
              {/* Decision Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Verification Decision *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="btn-modal-choose-approve"
                    onClick={() => {
                      setReviewAction('Approved');
                      setRemarks('Verified against college activity guidelines and certificates.');
                      setRemarksError('');
                    }}
                    className={`py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      reviewAction === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Activity</span>
                  </button>

                  <button
                    type="button"
                    id="btn-modal-choose-reject"
                    onClick={() => {
                      setReviewAction('Rejected');
                      setRemarks('');
                      setRemarksError('');
                    }}
                    className={`py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      reviewAction === 'Rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Activity</span>
                  </button>
                </div>
              </div>

              {/* Remarks Field */}
              <div>
                <label
                  htmlFor="reviewRemarks"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  {reviewAction === 'Rejected' ? 'Rejection Remarks (Mandatory) *' : 'Verification Remarks (Optional)'}
                </label>
                <textarea
                  id="reviewRemarks"
                  rows={3}
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    if (remarksError) setRemarksError('');
                  }}
                  placeholder={
                    reviewAction === 'Rejected'
                      ? 'Specify why this submission was rejected (e.g. invalid certificate, duplicate record, organizer mismatch)...'
                      : 'Optional notes regarding accreditation criteria or event quality...'
                  }
                  className={`w-full p-3 text-xs border rounded-xl focus:outline-none focus:ring-2 ${
                    remarksError
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-indigo-500 bg-white'
                  }`}
                />
                {remarksError && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{remarksError}</p>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id="btn-modal-cancel"
                  onClick={closeReviewModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-modal-submit-decision"
                  disabled={isProcessing}
                  className={`px-5 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    reviewAction === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <span>Confirm {reviewAction}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
