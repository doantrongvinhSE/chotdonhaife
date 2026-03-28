import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { CommentStatus } from '../../types/posts';

interface StatusDropdownProps {
  currentStatus: CommentStatus;
  onStatusChange: (status: CommentStatus) => void;
  disabled?: boolean;
  compact?: boolean;
  loading?: boolean;
}

const statusOptions = [
  {
    value: 'normal' as CommentStatus,
    label: 'CHƯA XỬ LÝ',
    chipClass: 'bg-blue-50 text-blue-600 border-blue-200',
    activeClass: 'bg-blue-50 text-blue-700',
  },
  {
    value: 'isCalling' as CommentStatus,
    label: 'ĐANG GỌI',
    chipClass: 'bg-amber-50 text-amber-600 border-amber-200',
    activeClass: 'bg-amber-50 text-amber-700',
  },
  {
    value: 'success' as CommentStatus,
    label: 'ĐÃ CHỐT',
    chipClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    activeClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    value: 'fail' as CommentStatus,
    label: 'THẤT BẠI',
    chipClass: 'bg-rose-50 text-rose-600 border-rose-200',
    activeClass: 'bg-rose-50 text-rose-700',
  },
];

const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  currentStatus, 
  onStatusChange, 
  disabled = false,
  compact = false,
  loading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 160 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentOption = statusOptions.find(option => option.value === currentStatus);

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 180;
    const shouldOpenTop = rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight;

    setMenuStyle({
      top: shouldOpenTop ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: compact ? 144 : 160,
    });
  };
  
  const handleStatusChange = (status: CommentStatus) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled || loading) return;

    if (!isOpen) {
      updateMenuPosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => updateMenuPosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [isOpen, compact]);

  const dropdownMenu = isOpen && !loading ? createPortal(
    <>
      <div
        className="fixed inset-0 z-[999998]"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[999999] p-1"
        style={{ top: menuStyle.top, left: menuStyle.left, width: menuStyle.width }}
      >
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={`
              w-full flex items-center justify-between ${compact ? 'px-2.5 py-1.5 text-[11px]' : 'px-3 py-2 text-xs'} rounded-md text-left font-semibold transition-colors
              ${currentStatus === option.value ? `${option.activeClass}` : 'text-slate-600 hover:bg-slate-50'}
            `}
          >
            <span className="truncate">{option.label}</span>
            {currentStatus === option.value && <Check className="w-3.5 h-3.5 text-current" />}
          </button>
        ))}
      </div>
    </>,
    document.body,
  ) : null;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`
          group inline-flex items-center gap-1.5 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'}
          rounded-md font-semibold border transition-all duration-200 ease-out
          hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.98]
          focus:outline-none focus:ring-2 focus:ring-blue-500/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
          ${currentOption?.chipClass || 'bg-blue-50 text-blue-600 border-blue-200'}
        `}
        aria-busy={loading}
      >
        {loading ? (
          <span className={`inline-block ${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} border-2 border-current/50 border-t-transparent rounded-full animate-spin`} />
        ) : null}
        <span className="truncate font-semibold tracking-wide">{currentOption?.label}</span>
        {!loading && <ChevronDown className={`w-3 h-3 transition-all duration-200 ${isOpen ? 'rotate-180' : 'group-hover:translate-y-[1px]'}`} />}
      </button>

      {dropdownMenu}
    </div>
  );
};

export default StatusDropdown;
