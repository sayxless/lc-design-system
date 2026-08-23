import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import './TabPills.css';

export type TabPillsSize = 'sm' | 'md';

export interface TabPillsItem {
  value: string;
  label: ReactNode;
  badge?: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  disabled?: boolean;
}

export interface TabPillsProps {
  items: TabPillsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel: string;
  size?: TabPillsSize;
  renderPanel?: (item: TabPillsItem) => ReactNode;
  className?: string;
}

export function TabPills({ items, value, defaultValue, onValueChange, ariaLabel, size = 'md', renderPanel, className }: TabPillsProps) {
  const generatedId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? items.find((item) => !item.disabled)?.value ?? '');
  const selectedValue = value ?? uncontrolledValue;
  const selectedItem = items.find((item) => item.value === selectedValue) ?? items.find((item) => !item.disabled);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const panelId = `${generatedId}-panel`;

  const selectValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabledItems = items.filter((item) => !item.disabled);
    const currentIndex = enabledItems.findIndex((item) => item.value === currentValue);
    const next = event.key === 'Home'
      ? enabledItems[0]
      : event.key === 'End'
        ? enabledItems.at(-1)
        : enabledItems[(currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + enabledItems.length) % enabledItems.length];
    if (!next) return;
    selectValue(next.value);
    tabRefs.current.get(next.value)?.focus();
  };

  return (
    <div className={['tab-pills', `tab-pills--${size}`, className].filter(Boolean).join(' ')}>
      <div className="tab-pills__scroll">
        <div className="tab-pills__list" role={renderPanel ? 'tablist' : undefined} aria-label={ariaLabel}>
          {items.map((item) => {
            const selected = item.value === selectedItem?.value;
            const tabId = `${generatedId}-${item.value}-tab`;
            return (
              <button
                ref={(element) => { if (element) tabRefs.current.set(item.value, element); else tabRefs.current.delete(item.value); }}
                className={['tab-pills__tab', selected && 'tab-pills__tab--selected'].filter(Boolean).join(' ')}
                id={tabId}
                key={item.value}
                type="button"
                role={renderPanel ? 'tab' : undefined}
                aria-selected={renderPanel ? selected : undefined}
                aria-controls={renderPanel ? panelId : undefined}
                tabIndex={renderPanel && !selected ? -1 : undefined}
                disabled={item.disabled}
                onClick={() => selectValue(item.value)}
                onKeyDown={(event) => onKeyDown(event, item.value)}
              >
                {item.iconStart && <span className="tab-pills__icon" aria-hidden="true">{item.iconStart}</span>}
                <span>{item.label}</span>
                {item.iconEnd && <span className="tab-pills__icon" aria-hidden="true">{item.iconEnd}</span>}
                {item.badge && <span className="tab-pills__badge">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>
      {renderPanel && selectedItem && <div className="tab-pills__panel" id={panelId} role="tabpanel" aria-labelledby={`${generatedId}-${selectedItem.value}-tab`}>{renderPanel(selectedItem)}</div>}
    </div>
  );
}
