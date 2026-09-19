import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { Calendar, Building2, Award, Eye, Edit3, Trash2, User } from 'lucide-react';

export default function ActivityCard({
  activity,
  isStudent = true,
  onDelete,
  onReview,
}) {
  const formattedDate = activity.activityDate
    ? new Date(activity.activityDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div
      id={`activity-card-${activity._id}`}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
            {activity.activityCategory}
          </span>
          <StatusBadge status={activity.verificationStatus} />
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 line-clamp-2 mb-1.5 hover:text-indigo-600 transition-colors">
          <Link to={`/student/activities/${activity._id}`}>
            {activity.activityTitle}
          </Link>
        </h4>

        {/* Event & Organizer */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{activity.eventName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{activity.organizer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {/* Admin view: show student name */}
          {!isStudent && activity.studentId && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium">
                {activity.studentId.name} ({activity.studentId.department})
              </span>
            </div>
          )}

          {/* Verification Remarks */}
          {activity.verification?.remarks && (
            <div
              className={`p-2 rounded-lg text-xs flex items-start gap-1.5 mt-2 ${
                activity.verificationStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : activity.verificationStatus === 'Rejected'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span className="font-semibold shrink-0">Remarks:</span>
              <span>{activity.verification.remarks}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Certificate & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400">Cert:</span>
          <StatusBadge status={activity.certificateStatus} type="certificate" />
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            id={`btn-view-${activity._id}`}
            to={`/student/activities/${activity._id}`}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="View full details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          {isStudent && (
            <>
              <Link
                id={`btn-edit-${activity._id}`}
                to={`/student/activities/edit/${activity._id}`}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                title="Edit activity"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              {onDelete && (
                <button
                  id={`btn-delete-${activity._id}`}
                  onClick={() => onDelete(activity)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                  title="Delete activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {!isStudent && onReview && (
            <button
              id={`btn-review-${activity._id}`}
              onClick={() => onReview(activity)}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-2xs"
            >
              Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
