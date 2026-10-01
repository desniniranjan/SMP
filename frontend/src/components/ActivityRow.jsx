import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

/**
 * Reusable Apple-Style Activity Row Component
 * Used by:
 * - StudentDashboard (Recent Activities)
 * - MyActivities (Activity List)
 * - AllActivities (Central Archive)
 *
 * Requirements:
 * - LEFT: Large activity number (01, 02)
 * - CENTER: Activity title, category · event, date
 * - RIGHT: Status pill, arrow (→)
 * - Approximately 40px vertical breathing room (py-[20px])
 * - Thin separator between records (#D2D2D7)
 * - On hover: background becomes #FFFFFF, arrow moves 4px right,
 *   transition 0.3s cubic-bezier(0,0,0.5,1)
 * - No shadow on every activity
 */
export default function ActivityRow({
  activity,
  index,
  linkTo,
  isStudent = true,
  onEdit,
  onDelete,
  onReview,
}) {
  const pad = (n) => String(n).padStart(2, '0');

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const title = activity.title || activity.activityTitle || 'Untitled Activity';
  const category = activity.category || activity.activityCategory || 'Activity';
  const eventName = activity.eventName || activity.organizer || 'Institutional Event';
  const dateFormatted = formatDate(activity.activityDate);
  const destination = linkTo || `/student/activities/${activity._id}`;

  return (
    <div className="border-b border-[#D2D2D7] last:border-b-0 w-full">
      <div
        id={`activity-row-${activity._id}`}
        className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-5 py-5 rounded-[18px] transition-all duration-300 ease-[cubic-bezier(0,0,0.5,1)] hover:bg-[#FFFFFF] w-full min-w-0"
      >
        {/* Clickable Area Overlay */}
        <Link
          to={destination}
          className="absolute inset-0 z-10"
          aria-label={`View record ${title}`}
        />

        {/* Left + Center Block */}
        <div className="flex items-start gap-4 sm:gap-6 flex-1 min-w-0 z-0">
          {/* LEFT: Large activity number */}
          <span className="text-[28px] sm:text-[40px] md:text-[44px] font-[600] text-[#6E6E73] group-hover:text-[#1D1D1F] transition-colors leading-none min-w-[36px] sm:min-w-[46px] select-none pt-[2px] shrink-0">
            {pad(index + 1)}
          </span>

          {/* CENTER: Title, Category · Event, Date */}
          <div className="space-y-[4px] min-w-0 flex-1">
            <h3 className="text-[17px] sm:text-[22px] md:text-[26px] font-[600] text-[#1D1D1F] leading-snug group-hover:text-[#0066CC] transition-colors break-words">
              {title}
            </h3>

            <div className="text-[14px] font-[400] text-[#6E6E73] flex flex-wrap items-center gap-[6px] break-words">
              <span className="font-[600] text-[#1D1D1F]">{category}</span>
              <span aria-hidden="true">·</span>
              <span className="break-words">{eventName}</span>
            </div>

            <div className="text-[12px] font-[400] text-[#6E6E73]">
              {dateFormatted}
            </div>
          </div>
        </div>

        {/* RIGHT: Status & Arrow (and optional actions) */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pl-12 md:pl-0 z-20 shrink-0">
          {/* Action buttons (if edit/delete passed) */}
          {(onEdit || onDelete || onReview) && (
            <div className="flex flex-wrap items-center gap-2 mr-2">
              {onEdit && (
                <button
                  type="button"
                  id={`btn-edit-${activity._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(activity);
                  }}
                  className="text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#D2D2D7] transition-colors cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  id={`btn-delete-${activity._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(activity);
                  }}
                  className="text-[12px] font-[600] px-[10px] py-[4px] rounded-[56px] bg-[#B64400]/10 text-[#B64400] hover:bg-[#B64400]/20 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              )}
              {onReview && (
                <button
                  type="button"
                  id={`btn-review-${activity._id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(activity);
                  }}
                  className="text-[12px] font-[600] px-[16px] py-[6px] rounded-[56px] bg-[#0066CC] text-[#FFFFFF] hover:bg-[#0066CC]/90 transition-colors cursor-pointer"
                >
                  Evaluate
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <StatusBadge status={activity.verificationStatus} />
            <span
              aria-hidden="true"
              className="text-[17px] sm:text-[24px] font-[600] text-[#6E6E73] group-hover:text-[#0066CC] transform transition-transform duration-300 ease-[cubic-bezier(0,0,0.5,1)] group-hover:translate-x-1 select-none"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
