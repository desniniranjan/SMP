import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  'Hackathon',
  'Workshop',
  'Technical Competition',
  'Seminar',
  'Internship',
  'Certification',
  'Sports',
  'Cultural Event',
  'Other',
];

const CERT_STATUSES = ['Available', 'Pending', 'Not Available'];

export default function ActivityForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  isEdit = false,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    activityTitle: '',
    activityCategory: 'Hackathon',
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
        activityTitle: initialData.activityTitle || initialData.title || '',
        activityCategory: initialData.activityCategory || initialData.category || 'Hackathon',
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
      newErrors.activityTitle = 'Activity title is required';
    }
    if (!formData.activityCategory) {
      newErrors.activityCategory = 'Category is required';
    }
    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }
    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
    }
    if (!formData.activityDate) {
      newErrors.activityDate = 'Activity date is required';
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
    <form id="activity-submission-form" onSubmit={handleSubmit} className="space-y-[46px] select-text">
      {/* ==========================================================
          01 — ACTIVITY
          Section numbers visually prominent with coloured section markers.
          ========================================================== */}
      <section className="space-y-[20px]">
        <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
          <span className="text-[28px] font-[600] text-[#0066CC] font-mono leading-none">
            01
          </span>
          <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
            ACTIVITY
          </h2>
        </div>

        <div className="space-y-[18px]">
          {/* Activity Title */}
          <div className="space-y-[6px]">
            <label
              htmlFor="activityTitle"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Activity Title *
            </label>
            <input
              id="activityTitle"
              name="activityTitle"
              type="text"
              value={formData.activityTitle}
              onChange={handleChange}
              placeholder="e.g. Smart India Hackathon"
              className="apple-input"
            />
            {errors.activityTitle && (
              <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.activityTitle}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-[6px]">
            <label
              htmlFor="activityCategory"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Category *
            </label>
            <select
              id="activityCategory"
              name="activityCategory"
              value={formData.activityCategory}
              onChange={handleChange}
              className="apple-input cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Event Name */}
          <div className="space-y-[6px]">
            <label
              htmlFor="eventName"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Event Name *
            </label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="e.g. Smart India Hackathon 2026 Grand Finale"
              className="apple-input"
            />
            {errors.eventName && (
              <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.eventName}</p>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================================
          02 — EVENT
          ========================================================== */}
      <section className="space-y-[20px]">
        <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
          <span className="text-[28px] font-[600] text-[#FF791B] font-mono leading-none">
            02
          </span>
          <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
            EVENT
          </h2>
        </div>

        <div className="space-y-[18px]">
          {/* Organizer */}
          <div className="space-y-[6px]">
            <label
              htmlFor="organizer"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Organizer *
            </label>
            <input
              id="organizer"
              name="organizer"
              type="text"
              value={formData.organizer}
              onChange={handleChange}
              placeholder="e.g. Ministry of Education / College Department"
              className="apple-input"
            />
            {errors.organizer && (
              <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.organizer}</p>
            )}
          </div>

          {/* Activity Date */}
          <div className="space-y-[6px]">
            <label
              htmlFor="activityDate"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Date *
            </label>
            <input
              id="activityDate"
              name="activityDate"
              type="date"
              value={formData.activityDate}
              onChange={handleChange}
              className="apple-input"
            />
            {errors.activityDate && (
              <p className="text-[12px] text-[#B64400] font-[600] mt-[4px]">{errors.activityDate}</p>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================================
          03 — RECORD
          ========================================================== */}
      <section className="space-y-[20px]">
        <div className="flex items-baseline gap-[12px] pb-[10px] border-b border-[#D2D2D7]">
          <span className="text-[28px] font-[600] text-[#B64400] font-mono leading-none">
            03
          </span>
          <h2 className="text-[17px] font-[600] text-[#1D1D1F] tracking-tight">
            RECORD
          </h2>
        </div>

        <div className="space-y-[18px]">
          {/* Certificate status */}
          <div className="space-y-[6px]">
            <label
              htmlFor="certificateStatus"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Certificate Status
            </label>
            <select
              id="certificateStatus"
              name="certificateStatus"
              value={formData.certificateStatus}
              onChange={handleChange}
              className="apple-input cursor-pointer"
            >
              {CERT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-[6px]">
            <label
              htmlFor="description"
              className="block text-[14px] font-[600] text-[#1D1D1F]"
            >
              Notes
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Notes on participation or achievement..."
              className="apple-input resize-none"
            />
          </div>
        </div>
      </section>

      {/* Form Submission Actions */}
      <div className="pt-4 sm:pt-5 border-t border-[#D2D2D7] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          id="btn-submit-activity"
          type="submit"
          disabled={isSubmitting}
          className="px-[28px] py-[10px] bg-[#0066CC] hover:bg-[#0066CC]/90 text-[#FFFFFF] text-[17px] font-[600] rounded-[56px] transition-colors disabled:opacity-50 cursor-pointer shadow-[2px_4px_12px_rgba(0,0,0,0.08)]"
        >
          {isSubmitting
            ? 'Saving...'
            : isEdit
            ? 'Save Changes'
            : 'Save Record'}
        </button>
      </div>
    </form>
  );
}
