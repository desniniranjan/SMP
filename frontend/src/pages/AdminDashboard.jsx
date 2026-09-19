import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import {
  Users,
  FolderKanban,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  BarChart3,
  Award,
} from 'lucide-react';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [deptSummary, setDeptSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [portalRes, deptRes] = await Promise.all([
        verificationService.getPortalSummary(),
        verificationService.getDepartmentSummary(),
      ]);

      if (portalRes.success) {
        setSummary(portalRes.data);
      }
      if (deptRes.success) {
        setDeptSummary(deptRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load administrator dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading administrator portal metrics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div
        id="admin-dashboard-banner"
        className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800"
      >
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-500/30 text-purple-200 uppercase tracking-wider mb-2 border border-purple-400/30">
            Administrator Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Activity Assessment & Verification Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Real-time monitoring across engineering departments, activity verification queues, and accreditation summaries.
          </p>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            id="btn-admin-verify-queue"
            to="/admin/verification"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Activities</span>
          </Link>
          <Link
            id="btn-admin-all-activities"
            to="/admin/activities"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            <span>All Activities</span>
          </Link>
          <Link
            id="btn-admin-reports"
            to="/admin/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 5 Required Metric Cards: Total Students, Total Activities, Pending, Approved, Rejected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div
          id="stat-total-students"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.totalStudents ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Enrolled candidates</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Total Activities */}
        <div
          id="stat-total-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Activities
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.totalActivities ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Total submissions</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Verification */}
        <div
          id="stat-pending-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
              Pending
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.pendingVerification ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting review</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Approved */}
        <div
          id="stat-approved-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Approved
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.approved ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Accredited</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected */}
        <div
          id="stat-rejected-activities"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
              Rejected
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {summary?.rejected ?? 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">With remarks</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Pending Verification Queue & Department Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Verification List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Pending Verification Queue
              </h2>
            </div>
            <Link
              to="/admin/verification"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {!summary?.pendingList || summary.pendingList.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No activities are currently waiting for verification.
              </div>
            ) : (
              summary.pendingList.map((act) => (
                <div
                  key={act._id}
                  className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {act.activityCategory}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {act.activityTitle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{act.studentId?.name}</span>
                      <span>•</span>
                      <span className="truncate">{act.studentId?.department}</span>
                    </div>
                  </div>

                  <Link
                    to={`/admin/verification?reviewId=${act._id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              to="/admin/verification"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Go to Full Verification Workbench →
            </Link>
          </div>
        </div>

        {/* Department-wise Activity Summary (MongoDB Aggregation Table) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Department Activity Breakdown
              </h2>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Full Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-3 py-3 text-center">Total</th>
                  <th className="px-3 py-3 text-center text-emerald-600">Approved</th>
                  <th className="px-3 py-3 text-center text-amber-500">Pending</th>
                  <th className="px-3 py-3 text-center text-rose-500">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptSummary.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                      No department records available yet.
                    </td>
                  </tr>
                ) : (
                  deptSummary.map((dept) => (
                    <tr key={dept.department} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800 truncate max-w-[180px]">
                        {dept.department}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-900">
                        {dept.totalActivities}
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-emerald-600">
                        {dept.approved}
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-amber-600">
                        {dept.pending}
                      </td>
                      <td className="px-3 py-3 text-center font-semibold text-rose-600">
                        {dept.rejected}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">
              Aggregated live via MongoDB pipeline from student record collections
            </span>
          </div>
        </div>
      </div>

      {/* Recent Submissions Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Recent Activity Submissions Across College
            </h2>
          </div>
          <Link
            to="/admin/activities"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {!summary?.recentSubmissions || summary.recentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No recent activity records submitted.
            </div>
          ) : (
            summary.recentSubmissions.map((act) => (
              <div
                key={act._id}
                className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {act.activityTitle}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {act.activityCategory}
                    </span>
                    <StatusBadge status={act.verificationStatus} />
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="font-medium text-slate-700">
                      Student: {act.studentId?.name} ({act.studentId?.department})
                    </span>
                    <span>• Event: {act.eventName}</span>
                    <span>
                      • Date:{' '}
                      {act.activityDate
                        ? new Date(act.activityDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/student/activities/${act._id}`}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/admin/verification?reviewId=${act._id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
