import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';

import closeIcon from '../../assets/figma/modal-close.svg';
import './Modal.css';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  size?: ModalSize;
  closeButton?: boolean;
  closeOnOverlayClick?: boolean;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ));
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  actions,
  size = 'md',
  closeButton = true,
  closeOnOverlayClick = true,
  restoreFocusRef,
  className,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    previousActiveElement.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appRoot = document.getElementById('root');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (appRoot) {
      appRoot.setAttribute('aria-hidden', 'true');
      (appRoot as HTMLElement & { inert: boolean }).inert = true;
    }

    requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      getFocusableElements(dialog)[0]?.focus();
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
        (appRoot as HTMLElement & { inert: boolean }).inert = false;
      }
      (restoreFocusRef?.current ?? previousActiveElement.current)?.focus();
    };
  }, [open, restoreFocusRef]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onOpenChange(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusableElements = getFocusableElements(dialog);
    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusableElements[0];
    const last = focusableElements.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="modal-overlay" onMouseDown={(event) => { if (closeOnOverlayClick && event.target === event.currentTarget) onOpenChange(false); }}>
      <div ref={dialogRef} className={['modal', `modal--${size}`, className].filter(Boolean).join(' ')} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onKeyDown}>
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">{title}</h2>
          {closeButton && <button className="modal__close" type="button" aria-label="Close dialog" onClick={() => onOpenChange(false)}><img src={closeIcon} alt="" /></button>}
        </header>
        <div className="modal__content">{children}</div>
        {actions && <footer className="modal__actions">{actions}</footer>}
      </div>
    </div>,
    document.body,
  );
}
