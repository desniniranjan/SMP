import React, { useState, useEffect } from 'react';
import activityService from '../services/activityService.js';
import verificationService from '../services/verificationService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ActivityRow from '../components/ActivityRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function AllActivities({ approvedOnly = false }) {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filterTabs = ['All', 'Workshops', 'Hackathons', 'Certifications', 'Sports', 'Technical'];

  useEffect(() => {
    fetchActivities();
  }, [approvedOnly]);

  const fetchActivities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = approvedOnly
        ? await verificationService.getApprovedActivities()
        : await activityService.getActivities();

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
      setError(err.message || 'Failed to fetch archive records');
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (categoryFilter !== 'All') {
      const cat = (act.category || act.activityCategory || '').toLowerCase();
      const targetCat = categoryFilter.toLowerCase();
      const singular = targetCat.endsWith('s') ? targetCat.slice(0, -1) : targetCat;
      if (!cat.includes(singular)) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (act.title || act.activityTitle || '').toLowerCase().includes(q);
      const matchEvent = (act.eventName || '').toLowerCase().includes(q);
      const matchStudent = (act.studentId?.name || act.studentName || '').toLowerCase().includes(q);
      const matchDept = (act.studentId?.department || act.department || '').toLowerCase().includes(q);
      return matchTitle || matchEvent || matchStudent || matchDept;
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Consulting repository..." />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="w-full space-y-8 sm:space-y-10 select-text">
      {error && (
        <div className="p-4 text-[14px] bg-[#FFFFFF] border border-[#B64400] text-[#B64400] rounded-[18px]">
          {error}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D2D2D7]">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-[600] text-[#1D1D1F] tracking-tight leading-tight break-words">
            {approvedOnly ? 'Accredited Records' : 'Central Repository'}
          </h1>
          <p className="text-[17px] font-[400] text-[#6E6E73] mt-[4px]">
            {approvedOnly
              ? 'Officially approved and certified student achievements.'
              : 'Institutional archive of student activities and extracurricular achievements.'}
          </p>
        </div>

        <div className="text-[14px] font-[600] text-[#6E6E73] shrink-0">
          {activities.length} Records
        </div>
      </section>

      {/* Search & Filter */}
      <section className="space-y-[20px]">
        <div className="space-y-[6px]">
          <label
            htmlFor="input-search-all-records"
            className="block text-[12px] font-[600] text-[#6E6E73] uppercase tracking-wider"
          >
            SEARCH ARCHIVE
          </label>
          <input
            id="input-search-all-records"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student candidate, title, department, or event..."
            className="apple-input"
          />
        </div>

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

      {/* List */}
      <section>
        {filteredActivities.length === 0 ? (
          <div className="py-[62px] text-center bg-[#FFFFFF] rounded-[18px] border border-[#D2D2D7]/60">
            <p className="text-[14px] text-[#6E6E73]">
              No activities found matching your criteria.
            </p>
          </div>
        ) : (
          <div>
            {filteredActivities.map((act, index) => {
              const linkTo = isAdmin
                ? `/admin/verification?reviewId=${act._id}`
                : `/student/activities/${act._id}`;

              return (
                <ActivityRow
                  key={act._id}
                  activity={act}
                  index={index}
                  linkTo={linkTo}
                  isStudent={!isAdmin}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
