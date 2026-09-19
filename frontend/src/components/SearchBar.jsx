import React from 'react';
import { Search, Filter, X } from 'lucide-react';

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
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-activity-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              id="btn-clear-search"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="sm:w-48">
          <select
            id="select-category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:w-40">
          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
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
          <div className="sm:w-56">
            <select
              id="select-department-filter"
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
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
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset Filters"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
