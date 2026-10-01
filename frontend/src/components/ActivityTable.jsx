import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

export default function ActivityTable({
  activities,
  isStudent = true,
  onDelete,
  onReview,
}) {
  const formatAcademicDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (!activities || activities.length === 0) {
    return (
      <div
        id="empty-activities-state"
        className="rounded-[18px] border border-[#D2D2D7]/60 bg-[#FFFFFF] p-[38px] text-center"
      >
        <h4 className="text-[17px] font-[600] text-[#1D1D1F]">
          No Records Found
        </h4>
        <p className="mt-[4px] text-[14px] text-[#6E6E73] max-w-sm mx-auto">
          {isStudent
            ? 'No activity records match your criteria.'
            : 'No activity records found in this view.'}
        </p>
        {isStudent && (
          <Link
            id="btn-empty-add-activity"
            to="/student/activities/new"
            className="mt-[16px] inline-flex items-center px-[20px] py-[8px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[14px] font-[600] rounded-[56px] transition-colors"
          >
            Add Activity
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-[18px] border border-[#D2D2D7]/60 bg-[#FFFFFF] overflow-hidden shadow-[2px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="w-full overflow-x-auto">
        <table id="table-activities-records" className="min-w-full text-left text-[14px] divide-y divide-[#D2D2D7]/60">
          <thead className="bg-[#F5F5F7] text-[#6E6E73] text-[12px] uppercase tracking-wider font-[600]">
            <tr>
              <th scope="col" className="px-[16px] py-[12px] text-center font-mono">#</th>
              {!isStudent && <th scope="col" className="px-[16px] py-[12px]">Candidate</th>}
              {!isStudent && <th scope="col" className="px-[16px] py-[12px]">Department</th>}
              <th scope="col" className="px-[16px] py-[12px]">Title</th>
              <th scope="col" className="px-[16px] py-[12px]">Category</th>
              <th scope="col" className="px-[16px] py-[12px]">Event & Organizer</th>
              <th scope="col" className="px-[16px] py-[12px]">Date</th>
              <th scope="col" className="px-[16px] py-[12px]">Status</th>
              <th scope="col" className="px-[16px] py-[12px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D2D2D7]/60 text-[#1D1D1F]">
            {activities.map((act, index) => {
              const formattedDate = formatAcademicDate(act.activityDate);

              return (
                <tr
                  key={act._id}
                  id={`activity-row-${act._id}`}
                  className="hover:bg-[#F5F5F7]/50 transition-colors"
                >
                  {/* Row Number */}
                  <td className="px-[16px] py-[14px] text-center font-mono text-[#6E6E73]">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Admin only: Student Column */}
                  {!isStudent && (
                    <td className="px-[16px] py-[14px] whitespace-nowrap">
                      <div className="font-[600] text-[#1D1D1F]">
                        {act.studentId?.name || 'Candidate'}
                      </div>
                      <div className="text-[12px] text-[#6E6E73] font-mono">
                        {act.studentId?.userId || act.studentId?.email}
                      </div>
                    </td>
                  )}

                  {/* Admin only: Department Column */}
                  {!isStudent && (
                    <td className="px-[16px] py-[14px] whitespace-nowrap text-[12px] text-[#6E6E73]">
                      {act.studentId?.department || 'N/A'}
                    </td>
                  )}

                  {/* Activity Title */}
                  <td className="px-[16px] py-[14px] min-w-[160px] max-w-[280px]">
                    <Link
                      to={`/student/activities/${act._id}`}
                      className="font-[600] text-[#1D1D1F] hover:text-[#0066CC] transition-colors line-clamp-2 break-words"
                    >
                      {act.activityTitle || act.title}
                    </Link>
                  </td>

                  {/* Category */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <span className="text-[12px] font-[600] text-[#0066CC]">
                      {act.activityCategory || act.category}
                    </span>
                  </td>

                  {/* Event & Organizer */}
                  <td className="px-[16px] py-[14px] text-[12px] min-w-[140px] max-w-[220px]">
                    <div className="font-[600] text-[#1D1D1F] truncate break-words">
                      {act.eventName}
                    </div>
                    <div className="text-[#6E6E73] truncate break-words">
                      {act.organizer}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap text-[12px] text-[#6E6E73]">
                    {formattedDate}
                  </td>

                  {/* Verification Status */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap">
                    <StatusBadge status={act.verificationStatus} />
                  </td>

                  {/* Actions */}
                  <td className="px-[16px] py-[14px] whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-[8px]">
                      <Link
                        id={`btn-table-view-${act._id}`}
                        to={`/student/activities/${act._id}`}
                        className="text-[12px] font-[600] text-[#0066CC] hover:underline"
                      >
                        View
                      </Link>

                      {isStudent && (
                        <>
                          <Link
                            id={`btn-table-edit-${act._id}`}
                            to={`/student/activities/edit/${act._id}`}
                            className="text-[12px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F]"
                          >
                            Edit
                          </Link>
                          {onDelete && (
                            <button
                              id={`btn-table-delete-${act._id}`}
                              onClick={() => onDelete(act)}
                              className="text-[12px] font-[400] text-[#B64400] hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}

                      {!isStudent && onReview && (
                        <button
                          id={`btn-table-review-${act._id}`}
                          onClick={() => onReview(act)}
                          className="px-[12px] py-[4px] text-[12px] font-[600] text-[#FFFFFF] bg-[#0066CC] hover:bg-[#0066CC]/90 rounded-[56px] transition-colors cursor-pointer"
                        >
                          Evaluate
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
