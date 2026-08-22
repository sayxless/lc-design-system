import { useId, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';

import resizeIcon from '../../assets/figma/textarea-resize.svg';
import './Textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: ReactNode;
  optional?: boolean;
  hint?: ReactNode;
  error?: boolean;
  errorMessage?: ReactNode;
  size?: TextareaSize;
  resizable?: boolean;
}

export function Textarea({
  label, optional = false, hint, error = false, errorMessage, size = 'md', resizable = true,
  className, disabled, required, id, rows = 3, 'aria-describedby': ariaDescribedBy, ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeStart = useRef<{ pointerId: number; height: number; y: number } | null>(null);
  const [manualHeight, setManualHeight] = useState<number>();
  const helpText = error ? errorMessage : hint;
  const helpId = helpText ? `${textareaId}-help` : undefined;
  const describedBy = [ariaDescribedBy, helpId].filter(Boolean).join(' ') || undefined;

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!textareaRef.current) return;
    event.preventDefault();
    resizeStart.current = { pointerId: event.pointerId, height: textareaRef.current.clientHeight, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const resize = (event: React.PointerEvent<HTMLSpanElement>) => {
    const start = resizeStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    setManualHeight(Math.max(60, start.height + event.clientY - start.y));
  };

  const stopResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (resizeStart.current?.pointerId === event.pointerId) resizeStart.current = null;
  };

  return (
    <div className={['textarea', `textarea--${size}`, error && 'textarea--error', disabled && 'textarea--disabled', !resizable && 'textarea--fixed', className].filter(Boolean).join(' ')}>
      {label && <label className="textarea__label" htmlFor={textareaId}><span>{label}</span>{required && <span aria-hidden="true">*</span>}{optional && <span className="textarea__optional">(optional)</span>}</label>}
      <div className="textarea__field">
        <textarea {...props} ref={textareaRef} id={textareaId} className="textarea__native" disabled={disabled} required={required} rows={rows} style={manualHeight ? { height: manualHeight } : undefined} aria-invalid={error || undefined} aria-describedby={describedBy} />
        {resizable && !disabled && <span className="textarea__resize-icon" aria-hidden="true" onPointerDown={startResize} onPointerMove={resize} onPointerUp={stopResize} onPointerCancel={stopResize}><img src={resizeIcon} alt="" /></span>}
      </div>
      {helpText && <p className="textarea__help" id={helpId}><span className="textarea__help-icon" aria-hidden="true">{error ? '!' : 'i'}</span><span>{helpText}</span></p>}
    </div>
  );
}
