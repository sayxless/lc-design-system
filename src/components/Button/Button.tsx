import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'destructive-outline';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment from the Figma Button component. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Shows the loading variant and prevents repeated activation. */
  loading?: boolean;
  /** Use for an icon-only control. An `aria-label` is required in this case. */
  iconOnly?: boolean;
  /** Turns off the subtle pressed scale for dense or motion-sensitive contexts. */
  disablePressMotion?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    startIcon,
    endIcon,
    loading = false,
    iconOnly = false,
    disablePressMotion = false,
    disabled,
    className,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const isIconOnly = iconOnly || loading;
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    isIconOnly && 'button--icon-only',
    loading && 'button--loading',
    disablePressMotion && 'button--static',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      ref={ref}
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <span className="button__spinner" aria-hidden="true" />
          {children && <span className="button__sr-only">{children}</span>}
        </>
      ) : (
        <>
          {startIcon && <span className="button__icon" aria-hidden="true">{startIcon}</span>}
          {children && <span className="button__label">{children}</span>}
          {endIcon && <span className="button__icon" aria-hidden="true">{endIcon}</span>}
        </>
      )}
    </button>
  );
});
