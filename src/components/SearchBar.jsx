import React from 'react';

export const CATEGORIES = [
  'All',
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

export const STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];

export const DEPARTMENTS = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  showDepartmentFilter = false,
  onResetFilters,
  placeholder = 'Search by title, event, organizer, or keywords...',
}) {
  const hasActiveFilters =
    searchQuery ||
    (categoryFilter && categoryFilter !== 'All') ||
    (statusFilter && statusFilter !== 'All') ||
    (departmentFilter && departmentFilter !== 'All');

  return (
    <div
      id="search-filter-panel"
      className="bg-[#FFFFFF] p-[16px] sm:p-[20px] rounded-[18px] border border-[#D2D2D7]/60 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] space-y-[12px]"
    >
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 text-[14px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            id="input-activity-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="apple-input"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] text-[12px] font-[600]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto min-w-[140px] flex-1 sm:flex-initial">
          <select
            id="select-category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="apple-input cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto min-w-[130px] flex-1 sm:flex-initial">
          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="apple-input cursor-pointer"
          >
            {STATUSES.map((stat) => (
              <option key={stat} value={stat}>
                {stat === 'All' ? 'All Statuses' : stat}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter (Admin) */}
        {showDepartmentFilter && (
          <div className="w-full sm:w-auto min-w-[180px] flex-1 sm:flex-initial">
            <select
              id="select-department-filter"
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="apple-input cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && onResetFilters && (
          <button
            id="btn-reset-filters"
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-[14px] font-[400] text-[#6E6E73] hover:text-[#1D1D1F] rounded-[56px] border border-[#D2D2D7] hover:bg-[#F5F5F7] transition-colors cursor-pointer shrink-0"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
