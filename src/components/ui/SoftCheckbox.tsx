import React from 'react';
import { Check } from 'lucide-react';

type CheckboxProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
};

export function SoftCheckbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={label || 'Chọn'}
      onClick={onChange}
      className={
        'inline-flex items-center justify-center h-5 w-5 rounded-full border transition-all ' +
        (checked
          ? 'border-green-400 bg-green-500 text-white shadow-[0_1px_6px_rgba(34,197,94,0.6)]'
          : 'border-white/30 bg-white/10 text-transparent hover:bg-white/15')
      }
    >
      <Check className="h-3.5 w-3.5" />
    </button>
  );
}
