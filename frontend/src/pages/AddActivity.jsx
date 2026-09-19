import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm.jsx';
import activityService from '../services/activityService.js';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AddActivity() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    try {
      const response = await activityService.createActivity(formData);
      if (response.success) {
        navigate('/student/activities', {
          state: { message: 'Activity submitted successfully and is pending verification.' },
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit activity record. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            id="btn-back-to-activities"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Add New Student Activity
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit your workshops, certifications, internships, or competitions for college verification.
          </p>
        </div>
      </div>

      {error && (
        <div
          id="add-activity-error"
          className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Activity Form Component */}
      <ActivityForm onSubmit={handleSubmit} isSubmitting={isSubmitting} isEdit={false} />
    </div>
  );
}
