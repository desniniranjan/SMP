import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Building2, Calendar, FileCheck, Layers, Type, FileText, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Workshop',
  'Seminar',
  'Internship',
  'Certification',
  'Hackathon',
  'Sports',
  'Cultural Event',
  'Technical Competition',
  'Other',
];

const CERT_STATUSES = ['Available', 'Not Available', 'Pending'];

export default function ActivityForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    activityTitle: '',
    activityCategory: 'Workshop',
    eventName: '',
    organizer: '',
    activityDate: new Date().toISOString().split('T')[0],
    certificateStatus: 'Pending',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        activityTitle: initialData.activityTitle || '',
        activityCategory: initialData.activityCategory || 'Workshop',
        eventName: initialData.eventName || '',
        organizer: initialData.organizer || '',
        activityDate: initialData.activityDate
          ? new Date(initialData.activityDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        certificateStatus: initialData.certificateStatus || 'Pending',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.activityTitle.trim()) {
      newErrors.activityTitle = 'Activity Title is required';
    }
    if (!formData.activityCategory) {
      newErrors.activityCategory = 'Activity Category is required';
    }
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event Name is required';
    }
    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
    }
    if (!formData.activityDate) {
      newErrors.activityDate = 'Activity Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form id="activity-submission-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit ? 'Edit Activity Record' : 'Record Activity Details'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Provide verifiable details about your academic or extracurricular participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Title */}
          <div className="md:col-span-2">
            <label
              htmlFor="activityTitle"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Activity Title *
            </label>
            <div className="relative">
              <Type className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="activityTitle"
                name="activityTitle"
                type="text"
                value={formData.activityTitle}
                onChange={handleChange}
                placeholder="e.g. Smart India Hackathon Finalist, Cloud Bootcamp, Paper Presentation"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.activityTitle
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.activityTitle && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.activityTitle}</p>
            )}
          </div>

          {/* Activity Category */}
          <div>
            <label
              htmlFor="activityCategory"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Activity Category *
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="activityCategory"
                name="activityCategory"
                value={formData.activityCategory}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Certificate Status */}
          <div>
            <label
              htmlFor="certificateStatus"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Certificate Status *
            </label>
            <div className="relative">
              <FileCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="certificateStatus"
                name="certificateStatus"
                value={formData.certificateStatus}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                {CERT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label
              htmlFor="eventName"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Event Name *
            </label>
            <div className="relative">
              <Award className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="eventName"
                name="eventName"
                type="text"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="e.g. Technovanza 2026, AWS Summit, IEEE Conclave"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.eventName
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.eventName && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.eventName}</p>
            )}
          </div>

          {/* Organizer */}
          <div>
            <label
              htmlFor="organizer"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Organizer *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="organizer"
                name="organizer"
                type="text"
                value={formData.organizer}
                onChange={handleChange}
                placeholder="e.g. IIT Bombay, CSE Dept, Google Developer Student Club"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.organizer
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.organizer && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.organizer}</p>
            )}
          </div>

          {/* Activity Date */}
          <div>
            <label
              htmlFor="activityDate"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Activity Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="activityDate"
                name="activityDate"
                type="date"
                value={formData.activityDate}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.activityDate
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-indigo-500 bg-white'
                }`}
              />
            </div>
            {errors.activityDate && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.activityDate}</p>
            )}
          </div>

          {/* Description & Learning Outcomes */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
            >
              Activity Description & Outcomes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your project, problem statement, key skills learned, or awards won..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          id="btn-cancel-activity"
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          id="btn-submit-activity"
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving Record...</span>
            </>
          ) : (
            <span>{isEdit ? 'Update Activity' : 'Submit for Verification'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
