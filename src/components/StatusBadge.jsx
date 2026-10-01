import React from 'react';

/**
 * Status Design (Exact Design Tokens):
 * - Small rounded status pills (radius: 56px, text: 12px, weight: 600)
 * - Approved: white background + blue accent treatment
 * - Pending: very light orange treatment (#FF791B/15, #B64400)
 * - Rejected: destructive treatment only (#B64400)
 * - Status remains visually secondary to activity title
 */
export default function StatusBadge({ status, type = 'verification' }) {
  if (type === 'certificate') {
    switch (status) {
      case 'Available':
        return (
          <span
            id="badge-cert-available"
            className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#FFFFFF] text-[#0066CC] border border-[#0066CC]/30 select-none whitespace-nowrap"
          >
            Certificate On File
          </span>
        );
      case 'Not Available':
        return (
          <span
            id="badge-cert-not-available"
            className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#B64400]/10 text-[#B64400] select-none whitespace-nowrap"
          >
            No Certificate
          </span>
        );
      case 'Pending':
      default:
        return (
          <span
            id="badge-cert-pending"
            className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#FF791B]/15 text-[#B64400] select-none whitespace-nowrap"
          >
            Certificate Awaited
          </span>
        );
    }
  }

  // Verification Status:
  switch (status) {
    case 'Approved':
      return (
        <span
          id="badge-status-approved"
          className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#FFFFFF] text-[#0066CC] border border-[#0066CC]/30 select-none whitespace-nowrap"
        >
          Approved
        </span>
      );
    case 'Rejected':
      return (
        <span
          id="badge-status-rejected"
          className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#B64400]/10 text-[#B64400] select-none whitespace-nowrap"
        >
          Rejected
        </span>
      );
    case 'Pending':
    default:
      return (
        <span
          id="badge-status-pending"
          className="inline-flex items-center text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#FF791B]/15 text-[#B64400] select-none whitespace-nowrap"
        >
          Pending
        </span>
      );
  }
}
