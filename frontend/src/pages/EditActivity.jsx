import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActivityForm from '../components/ActivityForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import activityService from '../services/activityService.js';
import { AlertCircle, ArrowLeft } from 'lucide-react';

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
      if (response.success) {
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
      if (response.success) {
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
    return <LoadingSpinner message="Loading activity details for editing..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <button
          id="btn-back-from-edit"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Edit Activity Record
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Update the activity information. Note: Editing resets verification status to "Pending" for re-evaluation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
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
