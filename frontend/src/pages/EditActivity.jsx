import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import activityService from '../services/activityService.js';

export default function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await activityService.getActivity(id);
      if (response && response.success) {
        setInitialData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch activity record');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await activityService.updateActivity(id, formData);
      if (response && response.success) {
        navigate('/student/activities', {
          state: { message: 'Activity record updated successfully.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to update activity record');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading record..." />;
  }

  return (
    <div className="w-full max-w-4xl space-y-8 sm:space-y-10 select-text">
      {/* Top Back Navigation */}
      <div className="border-b border-[#D2D2D7] pb-[12px]">
        <button
          id="btn-back-from-edit"
          onClick={() => navigate(-1)}
          className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          ← Cancel
        </button>
      </div>

      {/* Main Title */}
      <section className="space-y-[8px]">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-[600] text-[#1D1D1F] leading-tight tracking-tight break-words">
          EDIT
          <br />
          ACTIVITY
        </h1>
        <p className="text-[17px] font-[400] text-[#6E6E73] pt-[8px]">
          Modifying record. Changes will be updated in your transcript.
        </p>
      </section>

      {error && (
        <div
          id="edit-activity-error"
          className="p-[16px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] text-[14px] rounded-[18px]"
        >
          {error}
        </div>
      )}

      {initialData && (
        <ActivityForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isEdit={true}
        />
      )}
    </div>
  );
}
