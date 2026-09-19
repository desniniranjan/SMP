import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import activityService from '../services/activityService.js';
import StatusBadge from '../components/StatusBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  ArrowLeft,
  Calendar,
  Building2,
  Award,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Edit3,
} from 'lucide-react';

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
      if (response.success) {
        setActivity(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve activity details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading activity details..." />;
  }

  if (error || !activity) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">Activity Not Found</h3>
        <p className="text-sm text-slate-600">{error || 'This activity record does not exist or you lack permission to view it.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isOwner = user?.role === 'student' && activity.studentId?._id === user?._id;
  const formattedDate = activity.activityDate
    ? new Date(activity.activityDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const verificationDate = activity.verification?.verificationDate
    ? new Date(activity.verification.verificationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-from-details"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {isOwner && (
          <Link
            id="btn-edit-from-details"
            to={`/student/activities/edit/${activity._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Activity</span>
          </Link>
        )}
      </div>

      {/* Main Activity Detail Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-md bg-indigo-500/30 text-indigo-200 uppercase tracking-wide border border-indigo-400/30">
                {activity.activityCategory}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Record ID: {activity.activityId}
              </span>
            </div>
            <StatusBadge status={activity.verificationStatus} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {activity.activityTitle}
          </h1>
        </div>

        {/* Verification Status Callout */}
        {activity.verificationStatus === 'Approved' && (
          <div
            id="verification-approved-callout"
            className="bg-emerald-50 border-b border-emerald-100 p-6 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-900">
                Verified & Approved by College Administration
              </h4>
              <p className="text-xs text-emerald-700 leading-relaxed">
                This activity has been formally verified and is counted towards student activity credits
                and institutional accreditation records.
              </p>
              {activity.verification?.remarks && (
                <div className="mt-2 p-3 bg-white/80 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-medium">
                  <strong>Admin Remarks:</strong> "{activity.verification.remarks}"
                </div>
              )}
              {verificationDate && (
                <p className="text-[11px] text-emerald-600">
                  Verified on: {verificationDate}
                  {activity.verification?.verifiedBy?.name && ` by ${activity.verification.verifiedBy.name}`}
                </p>
              )}
            </div>
          </div>
        )}

        {activity.verificationStatus === 'Rejected' && (
          <div
            id="verification-rejected-callout"
            className="bg-rose-50 border-b border-rose-100 p-6 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-bold text-rose-900">
                Verification Rejected – Action Required
              </h4>
              <p className="text-xs text-rose-700 leading-relaxed">
                The administrator could not verify this record. Please review the official remarks below
                and edit the record or re-upload necessary verification details.
              </p>
              <div className="mt-2.5 p-3.5 bg-white rounded-lg border border-rose-200 text-xs text-rose-900">
                <p className="font-bold text-rose-800 uppercase tracking-wider text-[10px] mb-1">
                  Official Admin Remarks
                </p>
                <p className="font-medium">
                  {activity.verification?.remarks || 'No specific remarks provided by administrator.'}
                </p>
              </div>
              {verificationDate && (
                <p className="text-[11px] text-rose-600 mt-1">
                  Reviewed on: {verificationDate}
                  {activity.verification?.verifiedBy?.name && ` by ${activity.verification.verifiedBy.name}`}
                </p>
              )}
            </div>
          </div>
        )}

        {activity.verificationStatus === 'Pending' && (
          <div
            id="verification-pending-callout"
            className="bg-amber-50 border-b border-amber-100 p-5 flex items-center gap-3 text-amber-800 text-xs"
          >
            <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
            <span>
              This activity record has been submitted and is queued for verification by the department administrator.
            </span>
          </div>
        )}

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Event Name</span>
              </span>
              <p className="text-base font-bold text-slate-900">{activity.eventName}</p>
            </div>

            {/* Organizer */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Organizing Body / Institution</span>
              </span>
              <p className="text-base font-bold text-slate-900">{activity.organizer}</p>
            </div>

            {/* Activity Date */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Activity Participation Date</span>
              </span>
              <p className="text-base font-bold text-slate-900">{formattedDate}</p>
            </div>

            {/* Certificate Status */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Certificate Status</span>
              </span>
              <div className="mt-1">
                <StatusBadge status={activity.certificateStatus} type="certificate" />
              </div>
            </div>
          </div>

          {/* Student Profile Info */}
          {activity.studentId && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Student Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Student Name:</span>{' '}
                  <span className="font-semibold text-slate-900">{activity.studentId.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Student ID / Roll:</span>{' '}
                  <span className="font-mono font-semibold text-slate-900">{activity.studentId.userId}</span>
                </div>
                <div>
                  <span className="text-slate-500">Department:</span>{' '}
                  <span className="font-semibold text-slate-900">{activity.studentId.department}</span>
                </div>
              </div>
            </div>
          )}

          {/* Optional Description */}
          {activity.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Activity Notes & Learning Outcomes
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {activity.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
