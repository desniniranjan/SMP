import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import activityService from '../services/activityService.js';
import ActivityTable from '../components/ActivityTable.jsx';
import ActivityCard from '../components/ActivityCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FolderKanban, LayoutGrid, List, AlertCircle, CheckCheck } from 'lucide-react';

export default function AllActivities({ approvedOnly = false }) {
  const { user } = useAuth();
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(approvedOnly ? 'Approved' : 'All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchActivities();
  }, [approvedOnly]);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await activityService.getActivities();
      if (response && response.success) {
        let list = Array.isArray(response.data)
          ? response.data
          : (response.data?.activities || response.activities || []);
        if (approvedOnly) {
          list = list.filter((a) => a.verificationStatus === 'Approved');
        }
        setActivities(list);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch activity records');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (categoryFilter !== 'All' && act.activityCategory !== categoryFilter) {
      return false;
    }
    if (!approvedOnly && statusFilter !== 'All' && act.verificationStatus !== statusFilter) {
      return false;
    }
    if (
      departmentFilter !== 'All' &&
      act.studentId?.department !== departmentFilter
    ) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = act.activityTitle?.toLowerCase().includes(q);
      const matchEvent = act.eventName?.toLowerCase().includes(q);
      const matchStudent = act.studentId?.name?.toLowerCase().includes(q);
      const matchDept = act.studentId?.department?.toLowerCase().includes(q);
      const matchOrganizer = act.organizer?.toLowerCase().includes(q);
      const matchId = act.activityId?.toLowerCase().includes(q);
      return (
        matchTitle ||
        matchEvent ||
        matchStudent ||
        matchDept ||
        matchOrganizer ||
        matchId
      );
    }
    return true;
  });

  const isStudent = user?.role === 'student';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {approvedOnly ? (
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Accredited Records Repository</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800">
                Centralized College Repository
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {approvedOnly ? 'Approved Activity Records' : 'All Student Activity Records'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {approvedOnly
              ? 'Official verified records eligible for student activity credits and college NAAC/NBA criteria.'
              : 'Search and inspect activities submitted by students across all academic departments.'}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
          <button
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
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={approvedOnly ? 'Approved' : statusFilter}
        onStatusChange={setStatusFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        showDepartmentFilter={!isStudent}
        onResetFilters={() => {
          setSearchQuery('');
          setCategoryFilter('All');
          setStatusFilter(approvedOnly ? 'Approved' : 'All');
          setDepartmentFilter('All');
        }}
        placeholder="Search by student name, roll number, title, event, or organizer..."
      />

      {/* Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredActivities.length}</strong> of{' '}
          {activities.length} records
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Retrieving activity repository..." />
      ) : viewMode === 'table' ? (
        <ActivityTable
          activities={filteredActivities}
          isStudent={isStudent}
          onDelete={null}
          onReview={null}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              No activity records found matching the criteria.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <ActivityCard
                key={act._id}
                activity={act}
                isStudent={isStudent}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
