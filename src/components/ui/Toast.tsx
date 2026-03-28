import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: ToastType;
  duration?: number;
};

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-white',
    borderClass: 'border-green-200',
    textClass: 'text-green-700',
    iconColorClass: 'text-green-600',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-white',
    borderClass: 'border-red-200',
    textClass: 'text-red-600',
    iconColorClass: 'text-red-500',
  },
  warning: {
    icon: AlertCircle,
    bgClass: 'bg-white',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-700',
    iconColorClass: 'text-amber-500',
  },
  info: {
    icon: Info,
    bgClass: 'bg-white',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-700',
    iconColorClass: 'text-blue-600',
  },
};

export function Toast({ message, isVisible, onClose, type = 'success', duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isVisible, duration, onClose]);

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[999999]
        flex items-center gap-2 px-4 py-2.5
        ${config.bgClass} border ${config.borderClass}
        rounded-lg
        shadow-lg
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${config.iconColorClass}`} strokeWidth={2} />
      <span className={`text-sm ${config.textClass} font-medium leading-4`}>
        {message}
      </span>
    </div>
  );
}
