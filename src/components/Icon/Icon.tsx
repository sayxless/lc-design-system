import type { CSSProperties, HTMLAttributes } from 'react';

import triangle from '../../assets/figma/triangle.svg';
import aborted from '../../assets/icons/aborted.svg';
import batteryDone from '../../assets/icons/battery-done.svg';
import circleClose from '../../assets/icons/circle close.svg';
import circleDashed from '../../assets/icons/circle dashed.svg';
import circleFilled from '../../assets/icons/circle filled.svg';
import charging from '../../assets/icons/charging.svg';
import loader from '../../assets/icons/loader.svg';
import noCircleDashed from '../../assets/icons/no circle dashed.svg';
import noSignal from '../../assets/icons/no signal.svg';
import noSignal2 from '../../assets/icons/no-signal-2.svg';
import signal from '../../assets/icons/signal.svg';
import severityHigh from '../../assets/icons/severity-high.svg';
import severityLow from '../../assets/icons/severity-low.svg';
import severityMedium from '../../assets/icons/severity-medium.svg';
import severityStopper from '../../assets/icons/severity-stopper.svg';
import warning from '../../assets/icons/warning.svg';

import './Icon.css';

const iconAssets = {
  aborted,
  batteryDone,
  circleClose,
  circleDashed,
  circleFilled,
  charging,
  loader,
  noCircleDashed,
  noSignal,
  noSignal2,
  signal,
  severityHigh,
  severityLow,
  severityMedium,
  severityStopper,
  triangle,
  warning,
} as const;

export type IconName = keyof typeof iconAssets;
export type IconSize = 'sm' | 'md' | 'lg' | 'custom';
export type IconColorMode = 'currentColor' | 'original';

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Name from the local icon pack. */
  name: IconName;
  /** sm = 16 px, md = 20 px, lg = 24 px. */
  size?: IconSize;
  /** Explicit size for the custom variant; defaults to 32 px. */
  customSize?: number | string;
  /** Use the SVG's original fills instead of currentColor. */
  colorMode?: IconColorMode;
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
  colorMode = 'currentColor',
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
      {colorMode === 'original' ? <img className="icon__image" src={iconAssets[name]} alt="" /> : <span className="icon__glyph" />}
    </span>
  );
}
