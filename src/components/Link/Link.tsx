import { type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

import './Link.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  medium?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  disabled?: boolean;
}

export function Link({ medium = false, startIcon, endIcon, disabled = false, className, children, onClick, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <a
      {...props}
      className={['link', medium && 'link--medium', disabled && 'link--disabled', className].filter(Boolean).join(' ')}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      onClick={handleClick}
    >
      {startIcon && <span className="link__icon" aria-hidden="true">{startIcon}</span>}
      <span className="link__label">{children}</span>
      {endIcon && <span className="link__icon" aria-hidden="true">{endIcon}</span>}
    </a>
  );
}
