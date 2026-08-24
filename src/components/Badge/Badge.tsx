import type { HTMLAttributes, ReactNode } from 'react';

import { Icon, type IconName } from '../Icon';

import './Badge.css';

export type BadgeVariant = 'default' | 'filled' | 'state' | 'charger' | 'icon' | 'bare';
export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
export type UnitState = 'available' | 'unavailable';
export type ConnectionState = 'online' | 'offline';
export type UnitSetupState = 'not-assigned' | 'initial-setup';
export type ChargerState = 'available' | 'preparing' | 'charging' | 'charged' | 'not-started' | 'aborted' | 'unavailable' | 'faulted' | 'offline';
export type ChargerBadgePresentation = 'default' | 'condensed' | 'icon';
export type IncidentSeverity = 'stopper' | 'high' | 'medium' | 'low';
export type IncidentSeverityPresentation = 'default' | 'condensed';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  icon?: ReactNode;
  /** Leading value used by the segmented charger badge. */
  leadingValue?: ReactNode;
}

export function Badge({
  variant = 'default',
  tone = 'neutral',
  icon,
  leadingValue,
  className,
  children,
  ...props
}: BadgeProps) {
  const classes = ['badge', `badge--${variant}`, `badge--${tone}`, className].filter(Boolean).join(' ');

  if (variant === 'charger') {
    return (
      <span {...props} className={classes}>
        {leadingValue && <span className="badge__prefix">{leadingValue}</span>}
        <span className="badge__charger-icon" aria-hidden="true">{icon}</span>
        {children && <span className="badge__label">{children}</span>}
      </span>
    );
  }

  if (variant === 'icon') {
    return <span {...props} className={classes}><span className="badge__icon" aria-hidden="true">{icon}</span></span>;
  }

  return (
    <span {...props} className={classes}>
      {variant === 'state' && <span className="badge__dot" aria-hidden="true" />}
      {icon && <span className="badge__icon" aria-hidden="true">{icon}</span>}
      {children && <span className="badge__label">{children}</span>}
    </span>
  );
}

type SemanticBadgeProps = Omit<BadgeProps, 'children' | 'icon' | 'tone' | 'variant'>;

const unitStates: Record<UnitState, { label: string; tone: BadgeTone; muted?: boolean }> = {
  available: { label: 'Available', tone: 'success' },
  unavailable: { label: 'Unavailable', tone: 'neutral', muted: true },
};

export function UnitStateBadge({ state, className, ...props }: SemanticBadgeProps & { state: UnitState }) {
  const item = unitStates[state];
  return <Badge {...props} variant="state" tone={item.tone} className={[item.muted && 'badge--muted', className].filter(Boolean).join(' ')}>{item.label}</Badge>;
}

const connectionStates: Record<ConnectionState, { label: string; tone: BadgeTone; icon: IconName }> = {
  online: { label: 'Online', tone: 'success', icon: 'signal' },
  offline: { label: 'Offline', tone: 'danger', icon: 'noSignal2' },
};

export function ConnectionBadge({ state, className, ...props }: SemanticBadgeProps & { state: ConnectionState }) {
  const item = connectionStates[state];
  return <Badge {...props} tone={item.tone} icon={<Icon name={item.icon} />} className={['badge--connection', className].filter(Boolean).join(' ')}>{item.label}</Badge>;
}

const unitSetupStates: Record<UnitSetupState, { label: string }> = {
  'not-assigned': { label: 'Not assigned' },
  'initial-setup': { label: 'Initial setup' },
};

export function UnitSetupBadge({ state, className, ...props }: SemanticBadgeProps & { state: UnitSetupState }) {
  const item = unitSetupStates[state];
  return <Badge {...props} tone="warning" icon={<Icon name="warning" />} className={['badge--accent-icon', className].filter(Boolean).join(' ')}>{item.label}</Badge>;
}

const chargerStates: Record<ChargerState, { label: string; tone: BadgeTone; icon: IconName; muted?: boolean }> = {
  available: { label: 'Available', tone: 'success', icon: 'circleDashed' },
  preparing: { label: 'Preparing', tone: 'success', icon: 'circleFilled' },
  charging: { label: 'Charging', tone: 'success', icon: 'charging' },
  charged: { label: 'Charged', tone: 'neutral', icon: 'batteryDone' },
  'not-started': { label: 'Not started', tone: 'warning', icon: 'circleClose' },
  aborted: { label: 'Aborted', tone: 'warning', icon: 'aborted' },
  unavailable: { label: 'Unavailable', tone: 'neutral', icon: 'noCircleDashed', muted: true },
  faulted: { label: 'Faulted', tone: 'danger', icon: 'warning' },
  offline: { label: 'Offline', tone: 'danger', icon: 'noSignal2' },
};

export function ChargerStateBadge({
  state,
  presentation = 'default',
  leadingValue = '00',
  children,
  className,
  ...props
}: SemanticBadgeProps & { state: ChargerState; presentation?: ChargerBadgePresentation; children?: ReactNode }) {
  const item = chargerStates[state];
  const classes = [item.muted && 'badge--muted', 'badge--accent-icon', `badge--charger-state-${state}`, className].filter(Boolean).join(' ');
  const icon = <Icon name={item.icon} />;

  if (presentation === 'icon') return <Badge {...props} variant="icon" tone={item.tone} icon={icon} className={classes} aria-label={item.label} />;
  if (presentation === 'condensed') return <Badge {...props} variant="charger" tone={item.tone} leadingValue={leadingValue} icon={icon} className={classes}>{children}</Badge>;

  return <Badge {...props} tone={item.tone} icon={icon} className={classes}>{item.label}</Badge>;
}

const incidentSeverities: Record<IncidentSeverity, { label: string; tone: BadgeTone; icon: IconName; useOriginalIconColor?: boolean }> = {
  stopper: { label: 'Stopper', tone: 'danger', icon: 'severityStopper' },
  high: { label: 'High', tone: 'danger', icon: 'severityHigh' },
  medium: { label: 'Medium', tone: 'warning', icon: 'severityMedium' },
  low: { label: 'Low', tone: 'neutral', icon: 'severityLow', useOriginalIconColor: true },
};

export function IncidentSeverityBadge({
  severity,
  presentation = 'default',
  count,
  className,
  ...props
}: SemanticBadgeProps & { severity: IncidentSeverity; presentation?: IncidentSeverityPresentation; count?: ReactNode }) {
  const item = incidentSeverities[severity];
  const classes = ['badge--accent-icon', 'badge--severity', severity === 'stopper' && 'badge--severity-stopper', className].filter(Boolean).join(' ');
  const icon = <Icon name={item.icon} colorMode={item.useOriginalIconColor ? 'original' : 'currentColor'} />;

  if (presentation === 'condensed') return <Badge {...props} variant="bare" tone={item.tone} icon={icon} className={classes}>{count}</Badge>;

  return <Badge {...props} tone={item.tone} icon={icon} className={classes}>{item.label}</Badge>;
}
