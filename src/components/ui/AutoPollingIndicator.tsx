import { Wifi, Loader2 } from 'lucide-react';

type AutoPollingIndicatorProps = {
  isPolling: boolean;
  lastPollTime: Date | null;
};

export function AutoPollingIndicator({ isPolling, lastPollTime }: AutoPollingIndicatorProps) {
  const formatLastPollTime = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds}s trước`;
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes} phút trước`;
    } else {
      const hours = Math.floor(diffSeconds / 3600);
      return `${hours} giờ trước`;
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      {isPolling ? (
        <div className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Đang cập nhật...</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          <span>Auto cập nhật: {formatLastPollTime(lastPollTime)}</span>
        </div>
      )}
    </div>
  );
}
