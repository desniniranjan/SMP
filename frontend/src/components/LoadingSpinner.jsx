import React from 'react';

export default function LoadingSpinner({ message = 'Loading portal data...' }) {
  return (
    <div id="loading-spinner-container" className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-600">{message}</p>
      )}
    </div>
  );
}
