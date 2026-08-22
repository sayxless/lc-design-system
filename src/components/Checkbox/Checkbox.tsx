import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';

import checkIcon from '../../assets/figma/checkbox-check.svg';
import indeterminateIcon from '../../assets/figma/checkbox-indeterminate.svg';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: ReactNode;
  indeterminate?: boolean;
  error?: boolean;
}

export function Checkbox({
  label,
  indeterminate = false,
  error = false,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={['checkbox', disabled && 'checkbox--disabled', error && 'checkbox--error', className].filter(Boolean).join(' ')}>
      <input {...props} ref={inputRef} className="checkbox__input" type="checkbox" disabled={disabled} aria-invalid={error || undefined} />
      <span className="checkbox__control" aria-hidden="true">
        {indeterminate ? <img src={indeterminateIcon} alt="" /> : <img src={checkIcon} alt="" />}
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
}
