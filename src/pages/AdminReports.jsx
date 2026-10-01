import React, { useState, useEffect } from 'react';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

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

      if (deptRes && deptRes.success) {
        setDeptSummary(deptRes.data || []);
      }
      if (portalRes && portalRes.success) {
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

  const pad = (n) => String(n).padStart(2, '0');

  if (loading) {
    return <LoadingSpinner message="Aggregating records analytics..." />;
  }

  const grandTotal = deptSummary.reduce((acc, cur) => acc + (cur.totalActivities || 0), 0);
  const grandApproved = deptSummary.reduce((acc, cur) => acc + (cur.approved || 0), 0);
  const grandPending = deptSummary.reduce((acc, cur) => acc + (cur.pending || 0), 0);
  const grandRejected = deptSummary.reduce((acc, cur) => acc + (cur.rejected || 0), 0);

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D2D2D7]">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            Accreditation Reports
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73] mt-[4px]">
            Institutional audit metrics and departmental activity breakdown.
          </p>
        </div>

        <button
          id="btn-export-csv"
          onClick={handleExportCSV}
          disabled={deptSummary.length === 0}
          className="self-start sm:self-auto px-[20px] py-[8px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[14px] font-[600] rounded-[56px] transition-colors cursor-pointer disabled:opacity-50 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] shrink-0"
        >
          Export CSV ↓
        </button>
      </section>

      {/* Institutional Totals: One 18px-radius summary surface */}
      <section id="reports-summary" className="w-full">
        <div className="bg-[#FFFFFF] rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 p-6 sm:p-8 lg:p-10 w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 items-center w-full">
            {/* Total */}
            <div className="flex flex-col items-center lg:items-start lg:pr-6 xl:pr-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#1D1D1F] leading-none font-mono break-words">
                {pad(grandTotal)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Total Records
              </div>
            </div>

            {/* Approved */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#0066CC] leading-none font-mono break-words">
                {pad(grandApproved)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Approved
              </div>
            </div>

            {/* Pending */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:px-6 xl:px-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#FF791B] leading-none font-mono break-words">
                {pad(grandPending)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Pending
              </div>
            </div>

            {/* Disallowed */}
            <div className="flex flex-col items-center lg:items-start lg:border-l lg:border-[#D2D2D7] lg:pl-6 xl:pl-8 min-w-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-[600] text-[#B64400] leading-none font-mono break-words">
                {pad(grandRejected)}
              </div>
              <div className="text-[12px] font-[400] text-[#6E6E73] mt-[6px]">
                Rejected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Breakdown Table */}
      <section className="space-y-4 pt-2.5 w-full">
        <h2 className="text-2xl sm:text-3xl font-[600] text-[#1D1D1F] tracking-tight">
          Department Breakdown
        </h2>

        <div className="w-full overflow-x-auto rounded-[18px] bg-[#FFFFFF] border border-[#D2D2D7]/60 shadow-[2px_4px_12px_rgba(0,0,0,0.08)]">
          <table className="min-w-full text-left text-[14px]">
            <thead className="border-b border-[#D2D2D7] bg-[#F5F5F7]">
              <tr className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
                <th className="py-[16px] px-[20px]">Department</th>
                <th className="py-[16px] px-[20px] text-right">Total</th>
                <th className="py-[16px] px-[20px] text-right">Approved</th>
                <th className="py-[16px] px-[20px] text-right">Pending</th>
                <th className="py-[16px] px-[20px] text-right">Rejected</th>
                <th className="py-[16px] px-[20px] text-right">Approval Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D2D2D7]/60">
              {deptSummary.map((d) => {
                const rate =
                  d.totalActivities > 0
                    ? ((d.approved / d.totalActivities) * 100).toFixed(0)
                    : '0';

                return (
                  <tr key={d.department} className="hover:bg-[#F5F5F7]/50 transition-colors">
                    <td className="py-[16px] px-[20px] font-[600] text-[#1D1D1F]">
                      {d.department}
                    </td>
                    <td className="py-[16px] px-[20px] text-right font-mono text-[#1D1D1F]">
                      {pad(d.totalActivities)}
                    </td>
                    <td className="py-[16px] px-[20px] text-right font-mono text-[#0066CC]">
                      {pad(d.approved)}
                    </td>
                    <td className="py-[16px] px-[20px] text-right font-mono text-[#FF791B]">
                      {pad(d.pending)}
                    </td>
                    <td className="py-[16px] px-[20px] text-right font-mono text-[#B64400]">
                      {pad(d.rejected)}
                    </td>
                    <td className="py-[16px] px-[20px] text-right font-mono font-[600] text-[#0066CC]">
                      {rate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
