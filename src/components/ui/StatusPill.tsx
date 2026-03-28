import React from 'react';
import { RunningPost } from '../../types/posts';

type StatusPillProps = {
  status: RunningPost['status'];
};

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function StatusPill({ status }: StatusPillProps) {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border';
  
  if (status === 'Đang chạy') {
    return (
      <span className={classNames(base, 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25 shadow-[0_1px_8px_rgba(16,185,129,0.25)]')}>
        ● {status}
      </span>
    );
  }
  
  if (status === 'Tạm dừng') {
    return (
      <span className={classNames(base, 'text-amber-300 bg-amber-400/10 border-amber-400/25 shadow-[0_1px_8px_rgba(245,158,11,0.25)]')}>
        ● {status}
      </span>
    );
  }
  
  return (
    <span className={classNames(base, 'text-rose-300 bg-rose-400/10 border-rose-400/25 shadow-[0_1px_8px_rgba(244,63,94,0.25)]')}>
      ● {status}
    </span>
  );
}
