import React, { useState } from 'react';
import { Phone, Check, ChevronDown } from 'lucide-react';
import { removeVietnameseAccents } from '../utils/textUtils';
import useCallSettings from '../hooks/useCallSettings';
import { Toast } from '../components/ui/Toast';

// Generate DiceBear avatar URL from caller name
const getAvatarUrl = (name: string, size: number = 80) => {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}&size=${size}`;
};

const CallSettingsPage: React.FC = () => {
  const { callers, selectedCaller, loading, saveSelectedCaller } = useCallSettings();
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [hoveredCaller, setHoveredCaller] = useState<string | null>(null);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSelectCaller = (callerName: string) => {
    if (saveSelectedCaller(callerName)) {
      showToastMessage(`Đã chọn người gọi: ${callerName}`);
    } else {
      showToastMessage('Có lỗi xảy ra khi lưu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-full py-0 px-4 lg:px-8 flex items-center justify-center" style={{ backgroundColor: '#f5f7fa' }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-slate-600 text-lg">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full py-0 px-8" style={{ backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Cài đặt Người gọi</h1>
            <p className="text-xs text-slate-500">
              Chọn người gọi để sử dụng trong hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mb-6" style={{ backgroundColor: '#dde3ec' }}></div>

      {/* Select Caller Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm mb-6">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-semibold text-slate-800">Chọn người gọi</h2>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Chọn người sẽ được sử dụng làm người gọi mặc định cho hệ thống
          </p>

          {/* Caller Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {callers.map((caller, index) => {
              const isSelected = selectedCaller === caller;
              const isHovered = hoveredCaller === caller && !isSelected;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectCaller(caller)}
                  onMouseEnter={() => setHoveredCaller(caller)}
                  onMouseLeave={() => setHoveredCaller(null)}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : isHovered
                        ? 'border-blue-200 bg-slate-50 shadow-sm -translate-y-0.5'
                        : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }
                  `}
                >
                  {/* Avatar Circle */}
                  <div className={`
                    w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all duration-200
                    ${isSelected
                      ? 'shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2'
                      : isHovered
                        ? 'ring-2 ring-blue-200'
                        : ''
                    }
                  `}>
                    <img
                      src={getAvatarUrl(caller)}
                      alt={caller}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-slate-100', 'text-slate-400');
                          if (!parent.querySelector('.fallback-icon')) {
                            const icon = document.createElement('div');
                            icon.className = 'fallback-icon flex items-center justify-center w-full h-full';
                            icon.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
                            parent.appendChild(icon);
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Name */}
                  <span className={`
                    text-sm font-semibold transition-all duration-200
                    ${isSelected
                      ? 'text-blue-600'
                      : isHovered
                        ? 'text-slate-600'
                        : 'text-slate-500'
                    }
                  `}>
                    {caller}
                  </span>

                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Selection Info */}
          {selectedCaller && (
            <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: '#eff6ff' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-600">Người gọi đã chọn:</span>
                <span className="text-sm font-bold text-blue-700">{selectedCaller}</span>
                <span className="text-xs text-slate-400">—</span>
                <span className="text-xs text-slate-400 font-mono">
                  {removeVietnameseAccents(selectedCaller)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400" />
            Thông tin
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-500">
                Người gọi được chọn sẽ được sử dụng làm mặc định trong các cuộc gọi
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-500">
                Cài đặt này được lưu trên trình duyệt của bạn
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
              <p className="text-xs text-slate-500">
                Bạn có thể thay đổi người gọi bất kỳ lúc nào bằng cách chọn lại
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default CallSettingsPage;
