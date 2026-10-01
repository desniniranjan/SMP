import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm.jsx';
import activityService from '../services/activityService.js';

export default function AddActivity() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await activityService.createActivity(formData);
      if (response && response.success) {
        navigate('/student/activities', {
          state: { message: 'Activity record saved successfully.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit activity record. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8 sm:space-y-10 select-text">
      {/* Top Back Navigation */}
      <div className="border-b border-[#D2D2D7] pb-[12px]">
        <Link
          id="btn-back-to-activities"
          to="/student/activities"
          className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
        >
          ← Activities
        </Link>
      </div>

      {/* Large Title:
          ADD
          ACTIVITY */}
      <section className="space-y-[8px]">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-[600] text-[#1D1D1F] leading-tight tracking-tight break-words">
          ADD
          <br />
          ACTIVITY
        </h1>
        <p className="text-[17px] font-[400] text-[#6E6E73] pt-[8px]">
          Enter your academic or extracurricular record into the registry.
        </p>
      </section>

      {error && (
        <div
          id="add-activity-error"
          className="p-[16px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] text-[14px] rounded-[18px]"
        >
          {error}
        </div>
      )}

      {/* Form: Distinct unboxed sections with prominent markers */}
      <ActivityForm onSubmit={handleSubmit} isSubmitting={isSubmitting} isEdit={false} />
    </div>
  );
}
