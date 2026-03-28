import React from 'react';

type ToggleProps = {
  checked: boolean;
  onChange: () => void;
  srLabel?: string;
};

export function ToggleSwitch({ checked, onChange, srLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={srLabel || 'Toggle'}
      onClick={onChange}
      className={
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60 ' +
        (checked ? 'bg-green-500' : 'bg-gray-600')
      }
    >
      <span
        className={
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ' +
          (checked ? 'translate-x-4' : 'translate-x-1')
        }
      />
    </button>
  );
}
