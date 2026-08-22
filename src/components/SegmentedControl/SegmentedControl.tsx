import { type ReactNode } from 'react';

import './SegmentedControl.css';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onValueChange: (value: string) => void;
  'aria-label': string;
}

export function SegmentedControl({ options, value, onValueChange, 'aria-label': ariaLabel }: SegmentedControlProps) {
  return (
    <div className="segmented-control" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            className={['segmented-control__item', selected && 'segmented-control__item--selected'].filter(Boolean).join(' ')}
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={selected}
            onClick={() => onValueChange(option.value)}
          >
            {option.iconStart && <span className="segmented-control__icon" aria-hidden="true">{option.iconStart}</span>}
            <span>{option.label}</span>
            {option.iconEnd && <span className="segmented-control__icon" aria-hidden="true">{option.iconEnd}</span>}
            {option.badge !== undefined && <span className="segmented-control__badge">{option.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
