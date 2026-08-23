import type { CSSProperties, HTMLAttributes } from 'react';

import triangle from '../../assets/figma/triangle.svg';

import './Icon.css';

const iconAssets = {
  triangle,
} as const;

export type IconName = keyof typeof iconAssets;
export type IconSize = 'sm' | 'md' | 'lg' | 'custom';

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Name from the local icon pack. */
  name: IconName;
  /** sm = 16 px, md = 20 px, lg = 24 px. */
  size?: IconSize;
  /** Explicit size for the custom variant; defaults to 32 px. */
  customSize?: number | string;
}

const sizes: Record<Exclude<IconSize, 'custom'>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

function toCssSize(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

export function Icon({
  name,
  size = 'md',
  customSize,
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  const iconSize = size === 'custom' ? customSize ?? 32 : sizes[size];
  const classes = ['icon', `icon--${size}`, className].filter(Boolean).join(' ');
  const iconStyle = {
    ...style,
    '--icon-size': toCssSize(iconSize),
    '--icon-glyph': `url("${iconAssets[name]}")`,
  } as CSSProperties;

  return (
    <span
      {...props}
      className={classes}
      style={iconStyle}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <span className="icon__glyph" />
    </span>
  );
}
