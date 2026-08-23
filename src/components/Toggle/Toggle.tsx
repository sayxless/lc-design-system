import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

import handleMd from '../../assets/figma/toggle-handle-md.svg';
import handleLg from '../../assets/figma/toggle-handle-lg.svg';
import handleSmOff from '../../assets/figma/toggle-handle-sm-off.svg';
import handleSmOn from '../../assets/figma/toggle-handle-sm-on.svg';
import './Toggle.css';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: ToggleSize;
  labelStart?: ReactNode;
  labelEnd?: ReactNode;
}

const handleBySize = { md: handleMd, lg: handleLg };

export function Toggle({ size = 'md', labelStart, labelEnd, className, disabled, checked, defaultChecked = false, onChange, ...props }: ToggleProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = checked ?? uncontrolledChecked;
  const handle = size === 'sm' ? (isChecked ? handleSmOn : handleSmOff) : handleBySize[size];

  return (
    <label className={['toggle', `toggle--${size}`, disabled && 'toggle--disabled', className].filter(Boolean).join(' ')}>
      {labelStart && <span className="toggle__label">{labelStart}</span>}
      <input {...props} className="toggle__input" type="checkbox" disabled={disabled} checked={isControlled ? checked : undefined} defaultChecked={isControlled ? undefined : defaultChecked} onChange={(event) => { if (!isControlled) setUncontrolledChecked(event.target.checked); onChange?.(event); }} />
      <span className="toggle__control" aria-hidden="true"><span className="toggle__handle"><img src={handle} alt="" /></span></span>
      {labelEnd && <span className="toggle__label">{labelEnd}</span>}
    </label>
  );
}
