import { type InputHTMLAttributes, type ReactNode } from 'react';

import dotSm from '../../assets/figma/radio-dot-lg.svg';
import dotMd from '../../assets/figma/radio-dot.svg';
import dotLg from '../../assets/figma/radio-dot-sm.svg';
import './Radio.css';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode;
  size?: RadioSize;
  error?: boolean;
}

const dotBySize = { sm: dotSm, md: dotMd, lg: dotLg };

export function Radio({ label, size = 'sm', error = false, className, disabled, ...props }: RadioProps) {
  return (
    <label className={['radio', `radio--${size}`, disabled && 'radio--disabled', error && 'radio--error', className].filter(Boolean).join(' ')}>
      <input {...props} className="radio__input" type="radio" disabled={disabled} aria-invalid={error || undefined} />
      <span className="radio__control" aria-hidden="true"><img src={dotBySize[size]} alt="" /></span>
      {label && <span className="radio__label">{label}</span>}
    </label>
  );
}
