import React from 'react';
import ActivityRow from './ActivityRow.jsx';

/**
 * ActivityCard wrapper delegating to the unified ActivityRow component.
 * Ensures backward compatibility while enforcing unified Apple-style list design.
 */
export default function ActivityCard({
  activity,
  index = 0,
  isStudent = true,
  onDelete,
  onReview,
}) {
  return (
    <ActivityRow
      activity={activity}
      index={index}
      isStudent={isStudent}
      onDelete={onDelete}
      onReview={onReview}
    />
  );
}
