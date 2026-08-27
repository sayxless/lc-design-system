import { useId, useState, type ReactNode } from 'react';

import chevronDown from '../../assets/icons/chevron-down-small.svg';
import chevronUp from '../../assets/icons/chevron-top-small.svg';
import './SidebarNavigation.css';

export interface SidebarNavigationItem {
  id: string;
  label: ReactNode;
  /** Decorative icon displayed before the label. */
  iconLeft?: ReactNode;
  children?: SidebarNavigationItem[];
  disabled?: boolean;
}

export interface SidebarNavigationProps {
  items: SidebarNavigationItem[];
  activeItemId?: string;
  defaultActiveItemId?: string;
  defaultExpandedItemIds?: string[];
  onNavigate?: (item: SidebarNavigationItem) => void;
  ariaLabel: string;
  className?: string;
}

export function SidebarNavigation({
  items,
  activeItemId,
  defaultActiveItemId,
  defaultExpandedItemIds = [],
  onNavigate,
  ariaLabel,
  className,
}: SidebarNavigationProps) {
  const navigationId = useId();
  const [uncontrolledActiveItemId, setUncontrolledActiveItemId] = useState(defaultActiveItemId);
  const [expandedItemIds, setExpandedItemIds] = useState(() => new Set(defaultExpandedItemIds));
  const selectedItemId = activeItemId ?? uncontrolledActiveItemId;

  const selectItem = (item: SidebarNavigationItem) => {
    if (item.children?.length || item.disabled) return;
    if (activeItemId === undefined) setUncontrolledActiveItemId(item.id);
    onNavigate?.(item);
  };

  const toggleItem = (itemId: string) => {
    setExpandedItemIds((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  return (
    <nav className={['sidebar-navigation', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <ul className="sidebar-navigation__list">
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const isExpanded = expandedItemIds.has(item.id);
          const childrenId = `${navigationId}-${item.id}-children`;
          const visibleChildren = isExpanded
            ? item.children
            : item.children?.filter((child) => child.id === selectedItemId);

          return (
            <li className="sidebar-navigation__item" key={item.id}>
              {hasChildren ? (
                <button
                  className={['sidebar-navigation__row', 'sidebar-navigation__row--group', item.iconLeft && 'sidebar-navigation__row--with-icon'].filter(Boolean).join(' ')}
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={childrenId}
                  onClick={() => toggleItem(item.id)}
                  disabled={item.disabled}
                >
                  <span className="sidebar-navigation__group-content">
                    {item.iconLeft && <span className="sidebar-navigation__icon" aria-hidden="true">{item.iconLeft}</span>}
                    <span>{item.label}</span>
                  </span>
                  <img src={isExpanded ? chevronUp : chevronDown} alt="" aria-hidden="true" />
                </button>
              ) : (
                <button
                  className={['sidebar-navigation__row', item.iconLeft && 'sidebar-navigation__row--with-icon', selectedItemId === item.id && 'sidebar-navigation__row--active'].filter(Boolean).join(' ')}
                  type="button"
                  aria-current={selectedItemId === item.id ? 'page' : undefined}
                  onClick={() => selectItem(item)}
                  disabled={item.disabled}
                >
                  {item.iconLeft && <span className="sidebar-navigation__icon" aria-hidden="true">{item.iconLeft}</span>}
                  {item.label}
                </button>
              )}
              {hasChildren && visibleChildren?.length ? (
                <ul className="sidebar-navigation__children" id={childrenId}>
                  {visibleChildren.map((child) => (
                    <li key={child.id}>
                      <button
                        className={['sidebar-navigation__row', 'sidebar-navigation__row--nested', child.iconLeft && 'sidebar-navigation__row--with-icon', selectedItemId === child.id && 'sidebar-navigation__row--active'].filter(Boolean).join(' ')}
                        type="button"
                        aria-current={selectedItemId === child.id ? 'page' : undefined}
                        onClick={() => selectItem(child)}
                        disabled={child.disabled}
                      >
                        {child.iconLeft && <span className="sidebar-navigation__icon" aria-hidden="true">{child.iconLeft}</span>}
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
