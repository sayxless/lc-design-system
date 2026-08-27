import type { ReactNode } from 'react';

import closeIcon from '../../assets/figma/notification/close.svg';
import errorIcon from '../../assets/figma/notification/error.svg';
import infoIcon from '../../assets/figma/notification/info.svg';
import loadingIcon from '../../assets/figma/notification/loading.svg';
import successIcon from '../../assets/figma/notification/success.svg';
import warningIcon from '../../assets/figma/notification/warning.svg';
import './NotificationToast.css';

export type NotificationToastType = 'info' | 'success' | 'warning' | 'error' | 'loading';

export interface NotificationToastProps {
  /** Message displayed in the notification. */
  message: ReactNode;
  /** Optional heading for the extended Figma variant. */
  title?: ReactNode;
  /** Visual and semantic notification type. */
  type?: NotificationToastType;
  /** Called when the user activates the close button. */
  onDismiss?: () => void;
  /** Hides the close button. */
  closeButton?: boolean;
  /** Positions the toast in the bottom-left corner of the viewport. */
  fixed?: boolean;
  className?: string;
}

const icons: Record<NotificationToastType, string> = {
  info: infoIcon,
  success: successIcon,
  warning: warningIcon,
  error: errorIcon,
  loading: loadingIcon,
};

export function NotificationToast({
  message,
  title,
  type = 'info',
  onDismiss,
  closeButton = true,
  fixed = true,
  className,
}: NotificationToastProps) {
  const classes = [
    'notification-toast',
    `notification-toast--${type}`,
    fixed && 'notification-toast--fixed',
    className,
  ].filter(Boolean).join(' ');
  const isError = type === 'error';

  return (
    <div className={classes} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'}>
      <div className="notification-toast__content">
        <img className="notification-toast__icon" src={icons[type]} alt="" aria-hidden="true" />
        <div className="notification-toast__message">
          {title && <p className="notification-toast__title">{title}</p>}
          <p className="notification-toast__text">{message}</p>
        </div>
      </div>
      {closeButton && onDismiss && (
        <button className="notification-toast__close" type="button" onClick={onDismiss} aria-label="Dismiss notification">
          <img src={closeIcon} alt="" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
