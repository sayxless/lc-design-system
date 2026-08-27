import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type FocusEvent, type ReactElement, type ReactNode } from 'react';

import './Tooltip.css';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** Text or content shown in the tooltip. */
  content: ReactNode;
  /** The focusable element that reveals the tooltip. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  placement?: TooltipPlacement;
  /** Delay before the first tooltip in a group appears. */
  delay?: number;
  /** Duration in which following tooltips appear immediately. */
  skipDelayDuration?: number;
  /** Prevents the hint from appearing again after its trigger is activated. */
  disableAfterClick?: boolean;
  className?: string;
}

let instantOpenUntil = 0;

export function Tooltip({ content, children, placement = 'top', delay = 300, skipDelayDuration = 500, disableAfterClick = true, className }: TooltipProps) {
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const classes = ['tooltip', `tooltip--${placement}`, className].filter(Boolean).join(' ');

  const close = () => {
    window.clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  const show = () => {
    if (dismissed) return;
    window.clearTimeout(timeoutRef.current);
    const wait = Date.now() < instantOpenUntil ? 0 : delay;
    timeoutRef.current = window.setTimeout(() => {
      instantOpenUntil = Date.now() + skipDelayDuration;
      setOpen(true);
    }, wait);
  };

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  if (!isValidElement(children)) return null;

  return (
    <span
      className={[classes, open && 'tooltip--visible'].filter(Boolean).join(' ')}
      onPointerEnter={show}
      onPointerLeave={close}
      onFocus={show}
      onBlur={(event: FocusEvent<HTMLSpanElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
      onClick={() => { if (disableAfterClick) { close(); setDismissed(true); } }}
      onKeyDown={(event) => { if (event.key === 'Escape') close(); }}
    >
      {cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], !dismissed && descriptionId].filter(Boolean).join(' '),
      })}
      <span id={descriptionId} className="tooltip__content" role="tooltip">{content}</span>
    </span>
  );
}
