import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import activityService from '../services/activityService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ActivityRow from '../components/ActivityRow.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function MyActivities() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState(location.state?.message || '');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Confirm delete dialog state
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filterTabs = ['All', 'Workshops', 'Hackathons', 'Certifications', 'Sports', 'Technical'];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await activityService.getActivities();
      if (response && response.success) {
        const rawActivities = Array.isArray(response.data)
          ? response.data
          : (response.data?.activities || response.activities || []);
        setActivities(rawActivities);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student activities');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    // Category filter
    if (categoryFilter !== 'All') {
      const actCat = (act.category || act.activityCategory || '').toLowerCase();
      const targetCat = categoryFilter.toLowerCase();
      // handle plural/singular e.g. Workshops -> workshop, Hackathons -> hackathon
      const singular = targetCat.endsWith('s') ? targetCat.slice(0, -1) : targetCat;
      if (!actCat.includes(singular)) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (act.title || act.activityTitle || '').toLowerCase().includes(q);
      const matchEvent = (act.eventName || '').toLowerCase().includes(q);
      const matchOrganizer = (act.organizer || '').toLowerCase().includes(q);
      return matchTitle || matchEvent || matchOrganizer;
    }
    return true;
  });

  const handleEditClick = (activity) => {
    navigate(`/student/activities/edit/${activity._id}`);
  };

  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;
    setIsDeleting(true);
    try {
      const response = await activityService.deleteActivity(activityToDelete._id);
      if (response && response.success) {
        setActivities((prev) => prev.filter((a) => a._id !== activityToDelete._id));
        setSuccessBanner('Activity record deleted successfully.');
        setActivityToDelete(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete activity');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your activities..." />;
  }

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {/* Notifications */}
      {successBanner && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#0066CC] text-[#0066CC] rounded-[18px]">
          {successBanner}
        </div>
      )}
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* ==========================================================
          PAGE HEADER
          ACTIVITIES
          Your academic and extracurricular record.
          ========================================================== */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D2D2D7]">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            ACTIVITIES
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73] mt-[4px]">
            Your academic and extracurricular record.
          </p>
        </div>

        <Link
          id="btn-add-activity"
          to="/student/activities/new"
          className="self-start sm:self-auto text-[14px] font-[600] text-[#FFFFFF] bg-[#0066CC] hover:bg-[#0066CC]/90 transition-colors px-[20px] py-[8px] rounded-[56px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] shrink-0"
        >
          + Add Activity
        </Link>
      </section>

      {/* ==========================================================
          SEARCH & FILTERS
          ========================================================== */}
      <section className="space-y-[20px]">
        {/* Search */}
        <div className="space-y-[6px]">
          <label
            htmlFor="input-search-records"
            className="block text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider"
          >
            SEARCH
          </label>
          <input
            id="input-search-records"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities..."
            className="apple-input"
          />
        </div>

        {/* Filters */}
        <div className="space-y-[8px]">
          <div className="text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider">
            FILTERS
          </div>
          <div className="flex flex-wrap items-center gap-[8px]">
            {filterTabs.map((tab) => {
              const isActive = categoryFilter === tab;
              return (
                <button
                  key={tab}
                  id={`filter-tab-${tab.toLowerCase()}`}
                  onClick={() => setCategoryFilter(tab)}
                  className={`px-[16px] py-[6px] rounded-[56px] text-[14px] transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'bg-[#1D1D1F] text-[#FFFFFF] font-[600]'
                      : 'bg-[#FFFFFF] text-[#6E6E73] hover:text-[#1D1D1F] border border-[#D2D2D7] font-[400]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SAME ACTIVITY-ROW COMPONENT AS DASHBOARD
          ========================================================== */}
      <section>
        {filteredActivities.length === 0 ? (
          <div className="py-[62px] text-center bg-[#FFFFFF] rounded-[18px] border border-[#D2D2D7]/60">
            <p className="text-[14px] text-[#6E6E73]">
              No activities found matching your search.
            </p>
          </div>
        ) : (
          <div>
            {filteredActivities.map((act, index) => (
              <ActivityRow
                key={act._id}
                activity={act}
                index={index}
                linkTo={`/student/activities/${act._id}`}
                isStudent={true}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(activityToDelete)}
        title="Delete Activity Record"
        message={`Are you sure you want to delete "${activityToDelete?.title || activityToDelete?.activityTitle}"? This cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setActivityToDelete(null)}
      />
    </div>
  );
}
