import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import activityService from '../services/activityService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  Calendar,
  Building2,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

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

  // Metrics Calculation
  const totalActivities = activities.length;
  const pendingCount = activities.filter((a) => a.verificationStatus === 'Pending').length;
  const approvedCount = activities.filter((a) => a.verificationStatus === 'Approved').length;
  const rejectedCount = activities.filter((a) => a.verificationStatus === 'Rejected').length;

  // Recent activities (top 5)
  const recentActivities = activities.slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="Loading your activity dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        id="student-dashboard-header"
        className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/40 text-indigo-100 uppercase tracking-wider mb-2">
            Student Academic & Extracurricular Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-1 text-sm text-indigo-200">
            Student ID: <span className="font-mono text-white">{user?.userId}</span> •{' '}
            {user?.department}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            id="btn-dash-add-activity"
            to="/student/activities/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold text-sm rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Add Activity</span>
          </Link>
          <Link
            id="btn-dash-my-activities"
            to="/student/activities"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-800/80 hover:bg-indigo-800 text-white font-medium text-sm rounded-xl border border-indigo-600 transition-colors"
          >
            <span>View My Activities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Required Metric Cards: TOTAL, PENDING, APPROVED, REJECTED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Activities */}
        <div
          id="metric-total-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Activities
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {totalActivities}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Submitted records</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div
          id="metric-pending-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Pending
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {pendingCount}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Under faculty review</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Approved */}
        <div
          id="metric-approved-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Approved
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {approvedCount}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Accredited achievements</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Rejected */}
        <div
          id="metric-rejected-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">
              Rejected
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {rejectedCount}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Needs correction/remarks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Activities</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest academic & extracurricular activity submissions
            </p>
          </div>
          <Link
            id="link-view-all-recent"
            to="/student/activities"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All ({totalActivities})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentActivities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-800">
              No activities submitted yet
            </h4>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Click the "Add Activity" button to submit your first workshop, internship, or competition!
            </p>
            <Link
              id="btn-recent-empty-add"
              to="/student/activities/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Your First Activity</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => {
              const formattedDate = act.activityDate
                ? new Date(act.activityDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A';

              return (
                <div
                  key={act._id}
                  id={`recent-activity-${act._id}`}
                  className="p-5 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
                        {act.activityCategory}
                      </span>
                      <StatusBadge status={act.verificationStatus} />
                      <span className="text-xs text-slate-400 font-mono">
                        {act.activityId}
                      </span>
                    </div>

                    <Link
                      to={`/student/activities/${act._id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                    >
                      {act.activityTitle}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        {act.eventName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {act.organizer}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formattedDate}
                      </span>
                    </div>

                    {act.verification?.remarks && (
                      <div
                        id={`dash-remarks-${act._id}`}
                        className={`mt-2 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                          act.verificationStatus === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : act.verificationStatus === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="font-semibold shrink-0">Admin Remarks:</span>
                        <span>{act.verification.remarks}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <StatusBadge status={act.certificateStatus} type="certificate" />
                    <Link
                      id={`btn-view-recent-${act._id}`}
                      to={`/student/activities/${act._id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
