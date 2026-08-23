import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import chevronDown from '../../assets/figma/select-chevron-down.svg';
import './Select.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: ReactNode;
  optional?: boolean;
  placeholder?: string;
  hint?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: SelectSize;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
  'aria-describedby'?: string;
}

export function Select({
  options, value, defaultValue, onValueChange, name, label, optional = false,
  placeholder = 'Choose an option', hint, error = false, errorMessage, startIcon,
  endIcon, size = 'md', className, disabled = false, required = false, id,
  'aria-describedby': ariaDescribedBy,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const selectedValue = value ?? uncontrolledValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const helpText = error ? errorMessage : hint;
  const helpId = helpText ? `${selectId}-help` : undefined;
  const describedBy = [ariaDescribedBy, helpId].filter(Boolean).join(' ') || undefined;
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === selectedValue && !option.disabled));

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    listboxRef.current?.focus();
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const selectOption = (nextValue: string, keepOpen = false) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    if (!keepOpen) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const moveSelection = (direction: 1 | -1) => {
    const enabled = options.filter((option) => !option.disabled);
    if (!enabled.length) return;
    const current = enabled.findIndex((option) => option.value === selectedValue);
    const next = enabled[(current + direction + enabled.length) % enabled.length];
    selectOption(next.value, true);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((current) => !current);
    }
  };

  const onListboxKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(event.key === 'ArrowDown' ? 1 : -1);
    }
    if (event.key === 'Enter' && options[activeIndex]) {
      event.preventDefault();
      selectOption(options[activeIndex].value);
    }
  };

  return (
    <div ref={rootRef} className={['select', `select--${size}`, open && 'select--open', error && 'select--error', disabled && 'select--disabled', className].filter(Boolean).join(' ')} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      {label && <label className="select__label" id={`${selectId}-label`}><span>{label}</span>{required && <span aria-hidden="true">*</span>}{optional && <span className="select__optional">(optional)</span>}</label>}
      {name && <input type="hidden" name={name} value={selectedValue} />}
      <button ref={triggerRef} className="select__field" id={selectId} type="button" disabled={disabled} aria-labelledby={label ? `${selectId}-label` : undefined} aria-describedby={describedBy} aria-invalid={error || undefined} aria-haspopup="listbox" aria-expanded={open} aria-controls={listboxId} onClick={() => setOpen((current) => !current)} onKeyDown={onTriggerKeyDown}>
        {startIcon && <span className="select__icon" aria-hidden="true">{startIcon}</span>}
        <span className={['select__value', !selectedOption && 'select__value--placeholder'].filter(Boolean).join(' ')}>{selectedOption?.label ?? placeholder}</span>
        {endIcon && <span className="select__icon" aria-hidden="true">{endIcon}</span>}
        <span className="select__chevron" aria-hidden="true"><img src={chevronDown} alt="" /></span>
      </button>
      {open && <div ref={listboxRef} className="select__menu" id={listboxId} role="listbox" tabIndex={-1} aria-labelledby={label ? `${selectId}-label` : undefined} aria-activedescendant={options[activeIndex] ? `${selectId}-option-${activeIndex}` : undefined} onKeyDown={onListboxKeyDown}>
        {options.map((option, index) => <button className={['select__option', option.value === selectedValue && 'select__option--selected'].filter(Boolean).join(' ')} id={`${selectId}-option-${index}`} key={option.value} type="button" role="option" aria-selected={option.value === selectedValue} disabled={option.disabled} onClick={() => selectOption(option.value)}>{option.label}</button>)}
      </div>}
      {helpText && <p className="select__help" id={helpId}><span className="select__help-icon" aria-hidden="true">{error ? '!' : 'i'}</span><span>{helpText}</span></p>}
    </div>
  );
}
