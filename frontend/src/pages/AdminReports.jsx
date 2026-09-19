import React, { useState, useEffect } from 'react';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Award,
  Layers,
} from 'lucide-react';

export default function AdminReports() {
  const [deptSummary, setDeptSummary] = useState([]);
  const [portalSummary, setPortalSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      const [deptRes, portalRes] = await Promise.all([
        verificationService.getDepartmentSummary(),
        verificationService.getPortalSummary(),
      ]);

      if (deptRes.success) {
        setDeptSummary(deptRes.data || []);
      }
      if (portalRes.success) {
        setPortalSummary(portalRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate report summaries');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!deptSummary || deptSummary.length === 0) return;

    const headers = [
      'Department',
      'Total Activities',
      'Approved Activities',
      'Pending Verification',
      'Rejected Activities',
      'Approval Rate (%)',
    ];

    const rows = deptSummary.map((d) => {
      const rate =
        d.totalActivities > 0
          ? ((d.approved / d.totalActivities) * 100).toFixed(1)
          : '0.0';
      return [
        `"${d.department}"`,
        d.totalActivities,
        d.approved,
        d.pending,
        d.rejected,
        `${rate}%`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Student_Activity_Department_Report_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LoadingSpinner message="Calculating database aggregation metrics..." />;
  }

  const grandTotal = deptSummary.reduce((acc, cur) => acc + (cur.totalActivities || 0), 0);
  const grandApproved = deptSummary.reduce((acc, cur) => acc + (cur.approved || 0), 0);
  const grandPending = deptSummary.reduce((acc, cur) => acc + (cur.pending || 0), 0);
  const grandRejected = deptSummary.reduce((acc, cur) => acc + (cur.rejected || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Accreditation Compliance & Analytics</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Department Activity Analytics Report
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Aggregated metrics for NAAC / NBA Criterion 3 (Research, Innovations & Extension) and Criterion 5 (Student Support & Progression).
          </p>
        </div>

        <button
          id="btn-export-csv"
          onClick={handleExportCSV}
          disabled={deptSummary.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Department CSV</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Portal Submissions
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{grandTotal}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Across all departments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accredited / Approved</span>
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{grandApproved}</h3>
          <p className="text-xs text-emerald-700 mt-0.5">
            {grandTotal > 0 ? `${((grandApproved / grandTotal) * 100).toFixed(1)}% verification rate` : '0%'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Evaluation</span>
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{grandPending}</h3>
          <p className="text-xs text-amber-600 mt-0.5">In faculty queue</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected Records</span>
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{grandRejected}</h3>
          <p className="text-xs text-rose-600 mt-0.5">Returned with remarks</p>
        </div>
      </div>

      {/* Main Aggregation Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Department-Wise Activity Distribution Table
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            MongoDB $lookup & $group pipeline
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                <th className="px-4 py-4 text-center">Total Activities</th>
                <th className="px-4 py-4 text-center text-emerald-600">Approved</th>
                <th className="px-4 py-4 text-center text-amber-600">Pending</th>
                <th className="px-4 py-4 text-center text-rose-600">Rejected</th>
                <th className="px-6 py-4 text-right">Approval Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {deptSummary.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No department data found.
                  </td>
                </tr>
              ) : (
                deptSummary.map((dept) => {
                  const rate =
                    dept.totalActivities > 0
                      ? Math.round((dept.approved / dept.totalActivities) * 100)
                      : 0;

                  return (
                    <tr key={dept.department} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {dept.department}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-900">
                        {dept.totalActivities}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-emerald-600">
                        {dept.approved}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-amber-600">
                        {dept.pending}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-rose-600">
                        {dept.rejected}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="font-semibold text-xs text-slate-700 w-9 text-right">
                            {rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {deptSummary.length > 0 && (
              <tfoot className="bg-slate-100/70 font-bold text-slate-900 text-xs">
                <tr>
                  <td className="px-6 py-3.5">Grand Total</td>
                  <td className="px-4 py-3.5 text-center">{grandTotal}</td>
                  <td className="px-4 py-3.5 text-center text-emerald-700">{grandApproved}</td>
                  <td className="px-4 py-3.5 text-center text-amber-700">{grandPending}</td>
                  <td className="px-4 py-3.5 text-center text-rose-700">{grandRejected}</td>
                  <td className="px-6 py-3.5 text-right text-emerald-700">
                    {grandTotal > 0
                      ? `${Math.round((grandApproved / grandTotal) * 100)}%`
                      : '0%'}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
