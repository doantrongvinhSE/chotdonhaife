import React from 'react';
import { AlertTriangle, X, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  loading = false,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-500',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          iconBg: 'bg-red-50',
          iconBorder: 'border-red-100',
          headerBorder: 'border-slate-100',
          backdrop: 'rgba(239, 68, 68, 0.08)'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white',
          iconBg: 'bg-amber-50',
          iconBorder: 'border-amber-100',
          headerBorder: 'border-slate-100',
          backdrop: 'rgba(245, 158, 11, 0.08)'
        };
      case 'success':
        return {
          icon: 'text-emerald-500',
          confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          iconBg: 'bg-emerald-50',
          iconBorder: 'border-emerald-100',
          headerBorder: 'border-slate-100',
          backdrop: 'rgba(16, 185, 129, 0.08)'
        };
      case 'info':
      default:
        return {
          icon: 'text-blue-500',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          iconBg: 'bg-blue-50',
          iconBorder: 'border-blue-100',
          headerBorder: 'border-slate-100',
          backdrop: 'rgba(59, 130, 246, 0.08)'
        };
    }
  };

  const styles = getTypeStyles();

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
        style={{ border: '1px solid #e2e8f0' }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${styles.headerBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${styles.iconBg} ${styles.iconBorder}`}>
              <span className={styles.icon}>{getIcon()}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 rounded-xl transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirmButton} shadow-sm`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
