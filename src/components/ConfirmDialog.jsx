import React from 'react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you certain you wish to proceed?',
  confirmText = 'Confirm',
  confirmLabel,
  cancelText = 'Cancel',
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const actualConfirm = confirmLabel || confirmText;
  const actualCancel = cancelLabel || cancelText;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1D1F]/40 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        id="confirm-modal-card"
        className="bg-[#FFFFFF] max-w-md w-full p-6 sm:p-8 rounded-[18px] shadow-[2px_4px_12px_rgba(0,0,0,0.08)] border border-[#D2D2D7]/60 space-y-5 my-auto"
      >
        <div className="space-y-[6px]">
          <h3 id="confirm-modal-title" className="text-2xl sm:text-3xl font-[600] text-[#1D1D1F] tracking-tight break-words">
            {title}
          </h3>
          <p id="confirm-modal-message" className="text-[14px] text-[#6E6E73] leading-relaxed break-words">
            {message}
          </p>
        </div>

        <div className="pt-[16px] border-t border-[#D2D2D7] flex items-center justify-end gap-[12px]">
          <button
            id="btn-cancel-modal"
            type="button"
            onClick={onCancel}
            className="px-[20px] py-[8px] rounded-[56px] border border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors text-[14px] font-[400] cursor-pointer"
          >
            {actualCancel}
          </button>
          <button
            id="btn-confirm-action"
            type="button"
            onClick={onConfirm}
            className="px-[20px] py-[8px] rounded-[56px] bg-[#B64400] hover:bg-[#B64400]/90 text-[#FFFFFF] transition-colors text-[14px] font-[600] cursor-pointer shadow-[2px_4px_12px_rgba(0,0,0,0.08)]"
          >
            {actualConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
