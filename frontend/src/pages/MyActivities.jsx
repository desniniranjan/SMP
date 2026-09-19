import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import activityService from '../services/activityService.js';
import ActivityTable from '../components/ActivityTable.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { PlusCircle, LayoutGrid, List, AlertCircle, CheckCircle } from 'lucide-react';

export default function MyActivities() {
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successBanner, setSuccessBanner] = useState(location.state?.message || '');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState('table');

  // Confirm delete dialog state
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Client-side filtering for immediate reactivity
  const filteredActivities = activities.filter((act) => {
    // Category check
    if (categoryFilter !== 'All' && act.activityCategory !== categoryFilter) {
      return false;
    }
    // Status check
    if (statusFilter !== 'All' && act.verificationStatus !== statusFilter) {
      return false;
    }
    // Search query check
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = act.activityTitle?.toLowerCase().includes(q);
      const matchEvent = act.eventName?.toLowerCase().includes(q);
      const matchOrganizer = act.organizer?.toLowerCase().includes(q);
      const matchId = act.activityId?.toLowerCase().includes(q);
      return matchTitle || matchEvent || matchOrganizer || matchId;
    }
    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setStatusFilter('All');
  };

  // Delete flow
  const handleDeleteClick = (activity) => {
    setActivityToDelete(activity);
  };

  const handleConfirmDelete = async () => {
    if (!activityToDelete) return;
    setIsDeleting(true);
    try {
      const response = await activityService.deleteActivity(activityToDelete._id);
      if (response.success) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Activity Records
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your academic activities, track verification status, or update details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
            <button
              id="btn-view-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link
            id="btn-my-add-activity"
            to="/student/activities/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Activity</span>
          </Link>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div
          id="success-banner-alert"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold uppercase ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Component */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onResetFilters={handleResetFilters}
        placeholder="Search my activities by title, event name, or organizer..."
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredActivities.length}</strong> of{' '}
          {activities.length} activities
        </span>
      </div>

      {/* Activity Content */}
      {loading ? (
        <LoadingSpinner message="Retrieving your activity records..." />
      ) : viewMode === 'table' ? (
        <ActivityTable
          activities={filteredActivities}
          isStudent={true}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              No activities found matching your search.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <ActivityCard
                key={act._id}
                activity={act}
                isStudent={true}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!activityToDelete}
        title="Delete Activity Record"
        message={`Are you sure you want to permanently delete "${activityToDelete?.activityTitle}"? This action cannot be undone and will remove all verification records.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete Record'}
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setActivityToDelete(null)}
      />
    </div>
  );
}
