import React from 'react';
import { Clock, CheckCircle2, XCircle, FileCheck, FileQuestion, FileX } from 'lucide-react';

export default function StatusBadge({ status, type = 'verification' }) {
  if (type === 'certificate') {
    switch (status) {
      case 'Available':
        return (
          <span
            id="badge-cert-available"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Available</span>
          </span>
        );
      case 'Not Available':
        return (
          <span
            id="badge-cert-not-available"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200"
          >
            <FileX className="w-3.5 h-3.5" />
            <span>Not Available</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span
            id="badge-cert-pending"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  }

  // Verification Status Badge
  switch (status) {
    case 'Approved':
      return (
        <span
          id="badge-status-approved"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved</span>
        </span>
      );
    case 'Rejected':
      return (
        <span
          id="badge-status-rejected"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejected</span>
        </span>
      );
    case 'Pending':
    default:
      return (
        <span
          id="badge-status-pending"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs"
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Pending</span>
        </span>
      );
  }
}
