import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { Eye, Edit3, Trash2, Calendar, FileText, UserCheck } from 'lucide-react';

export default function ActivityTable({
  activities,
  isStudent = true,
  onDelete,
  onReview,
}) {
  if (!activities || activities.length === 0) {
    return (
      <div
        id="empty-activities-state"
        className="bg-white rounded-xl border border-slate-200 p-12 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-800">
          No activities submitted yet
        </h4>
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
          {isStudent
            ? 'Start building your academic record by submitting your first workshop, certification, or hackathon achievement.'
            : 'No student activities match the current filter criteria.'}
        </p>
        {isStudent && (
          <Link
            id="btn-empty-add-activity"
            to="/student/activities/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors"
          >
            Add New Activity
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table id="table-activities-records" className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <tr>
              {!isStudent && <th scope="col" className="px-5 py-3.5">Student</th>}
              {!isStudent && <th scope="col" className="px-4 py-3.5">Department</th>}
              <th scope="col" className="px-5 py-3.5">Activity Title</th>
              <th scope="col" className="px-4 py-3.5">Category</th>
              <th scope="col" className="px-4 py-3.5">Event & Organizer</th>
              <th scope="col" className="px-4 py-3.5">Date</th>
              <th scope="col" className="px-4 py-3.5">Certificate</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {activities.map((act) => {
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
                  id={`activity-row-${act._id}`}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* Admin only: Student Column */}
                  {!isStudent && (
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {act.studentId?.name || 'Unknown Student'}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {act.studentId?.userId || act.studentId?.email}
                      </div>
                    </td>
                  )}

                  {/* Admin only: Department Column */}
                  {!isStudent && (
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                      <span className="font-medium">
                        {act.studentId?.department || 'N/A'}
                      </span>
                    </td>
                  )}

                  {/* Activity Title */}
                  <td className="px-5 py-4">
                    <Link
                      to={`/student/activities/${act._id}`}
                      className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {act.activityTitle}
                    </Link>
                    <div className="text-xs text-slate-400 font-mono">
                      ID: {act.activityId}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {act.activityCategory}
                    </span>
                  </td>

                  {/* Event & Organizer */}
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-800 line-clamp-1">
                      {act.eventName}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {act.organizer}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Certificate Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={act.certificateStatus} type="certificate" />
                  </td>

                  {/* Verification Status */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status={act.verificationStatus} />
                    {act.verification?.remarks && (
                      <div className="text-[11px] text-slate-500 max-w-[160px] truncate mt-1" title={act.verification.remarks}>
                        "{act.verification.remarks}"
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        id={`btn-table-view-${act._id}`}
                        to={`/student/activities/${act._id}`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {isStudent && (
                        <>
                          <Link
                            id={`btn-table-edit-${act._id}`}
                            to={`/student/activities/edit/${act._id}`}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Edit activity"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          {onDelete && (
                            <button
                              id={`btn-table-delete-${act._id}`}
                              onClick={() => onDelete(act)}
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
                          id={`btn-table-review-${act._id}`}
                          onClick={() => onReview(act)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
