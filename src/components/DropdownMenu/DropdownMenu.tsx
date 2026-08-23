import { cloneElement, useEffect, useId, useRef, useState, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';

import './DropdownMenu.css';

export interface DropdownMenuItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactElement<{ onClick?: MouseEventHandler<HTMLButtonElement> }>;
  items: DropdownMenuItem[];
  onAction?: (item: DropdownMenuItem) => void;
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({ trigger, items, onAction, align = 'start', className }: DropdownMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [open, setOpen] = useState(false);
  const enabledItems = items.filter((item) => !item.disabled);

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return undefined;
    const firstItem = enabledItems[0];
    if (firstItem) requestAnimationFrame(() => itemRefs.current.get(firstItem.id)?.focus());

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const moveFocus = (currentId: string, direction: 1 | -1) => {
    const currentIndex = enabledItems.findIndex((item) => item.id === currentId);
    const next = enabledItems[(currentIndex + direction + enabledItems.length) % enabledItems.length];
    itemRefs.current.get(next.id)?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const activeId = Array.from(itemRefs.current.entries()).find(([, element]) => element === document.activeElement)?.[0];
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const item = event.key === 'Home' ? enabledItems[0] : enabledItems.at(-1);
      if (item) itemRefs.current.get(item.id)?.focus();
      return;
    }
    if (activeId && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      moveFocus(activeId, event.key === 'ArrowDown' ? 1 : -1);
    }
  };

  const triggerWithMenuProps = cloneElement(trigger as ReactElement<any>, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      trigger.props.onClick?.(event);
      if (!event.defaultPrevented) setOpen((current) => !current);
    },
  });

  return (
    <div ref={rootRef} className={['dropdown-menu', `dropdown-menu--${align}`, className].filter(Boolean).join(' ')}>
      {triggerWithMenuProps}
      {open && (
        <div className="dropdown-menu__content" id={menuId} role="menu" aria-orientation="vertical" onKeyDown={onMenuKeyDown}>
          {items.map((item) => (
            <div className="dropdown-menu__entry" key={item.id}>
              {item.separatorBefore && <div className="dropdown-menu__separator" role="separator" />}
              <button
                ref={(element) => { if (element) itemRefs.current.set(item.id, element); else itemRefs.current.delete(item.id); }}
                className={['dropdown-menu__item', item.destructive && 'dropdown-menu__item--destructive'].filter(Boolean).join(' ')}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => { onAction?.(item); close(true); }}
              >
                {item.icon && <span className="dropdown-menu__icon" aria-hidden="true">{item.icon}</span>}
                <span className="dropdown-menu__item-copy"><span>{item.label}</span>{item.description && <small>{item.description}</small>}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
