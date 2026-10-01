import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div id="loading-spinner-container" className="flex flex-col items-center justify-center py-[62px] px-[16px]">
      <div className="w-[38px] h-[38px] rounded-[50%] border-2 border-[#D2D2D7] border-t-[#0066CC] animate-spin mb-[16px]" />
      {message && (
        <p className="text-[14px] font-[400] text-[#6E6E73]">
          {message}
        </p>
      )}
    </div>
  );
}
