import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

import './TextInput.css';

export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: TextInputSize;
}

export function TextInput({
  label,
  optional = false,
  hint,
  error = false,
  errorMessage,
  startIcon,
  endIcon,
  size = 'md',
  className,
  disabled,
  required,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpText = error ? errorMessage : hint;
  const helpId = helpText ? `${inputId}-help` : undefined;
  const describedBy = [ariaDescribedBy, helpId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['text-input', `text-input--${size}`, error && 'text-input--error', disabled && 'text-input--disabled', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="text-input__label" htmlFor={inputId}>
          <span>{label}</span>
          {required && <span aria-hidden="true">*</span>}
          {optional && <span className="text-input__optional">(optional)</span>}
        </label>
      )}
      <div className="text-input__field">
        {startIcon && <span className="text-input__icon" aria-hidden="true">{startIcon}</span>}
        <input
          {...props}
          id={inputId}
          className="text-input__native"
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
        />
        {endIcon && <span className="text-input__icon" aria-hidden="true">{endIcon}</span>}
      </div>
      {helpText && (
        <p className="text-input__help" id={helpId}>
          <span className="text-input__help-icon" aria-hidden="true">{error ? '!' : 'i'}</span>
          <span>{helpText}</span>
        </p>
      )}
    </div>
  );
}
