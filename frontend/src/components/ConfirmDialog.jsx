import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div
        id="confirm-modal-card"
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id="confirm-modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
          </div>
          <button
            id="btn-close-modal"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p id="confirm-modal-message" className="mt-3 text-sm text-slate-600 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-modal"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200"
          >
            {cancelText}
          </button>
          <button
            id="btn-confirm-action"
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:ring-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-300'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
