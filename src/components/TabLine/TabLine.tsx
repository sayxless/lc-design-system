import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import './TabLine.css';

export interface TabLineItem {
  value: string;
  label: ReactNode;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  disabled?: boolean;
}

export interface TabLineProps {
  items: TabLineItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel: string;
  renderPanel?: (item: TabLineItem) => ReactNode;
  className?: string;
}

export function TabLine({ items, value, defaultValue, onValueChange, ariaLabel, renderPanel, className }: TabLineProps) {
  const generatedId = useId();
  const initialValue = defaultValue ?? items.find((item) => !item.disabled)?.value ?? '';
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue);
  const selectedValue = value ?? uncontrolledValue;
  const selectedItem = items.find((item) => item.value === selectedValue) ?? items.find((item) => !item.disabled);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const selectValue = (nextValue: string) => {
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentValue: string) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabledItems = items.filter((item) => !item.disabled);
    const currentIndex = enabledItems.findIndex((item) => item.value === currentValue);
    const nextItem = event.key === 'Home'
      ? enabledItems[0]
      : event.key === 'End'
        ? enabledItems.at(-1)
        : enabledItems[(currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + enabledItems.length) % enabledItems.length];
    if (!nextItem) return;
    selectValue(nextItem.value);
    tabRefs.current.get(nextItem.value)?.focus();
  };

  const panelId = `${generatedId}-panel`;

  return (
    <div className={['tab-line', className].filter(Boolean).join(' ')}>
      <div className="tab-line__scroll">
        <div className="tab-line__list" role="tablist" aria-label={ariaLabel}>
          {items.map((item) => {
            const selected = item.value === selectedItem?.value;
            const tabId = `${generatedId}-${item.value}-tab`;
            return (
              <button
                ref={(element) => { if (element) tabRefs.current.set(item.value, element); else tabRefs.current.delete(item.value); }}
                className={['tab-line__tab', selected && 'tab-line__tab--selected'].filter(Boolean).join(' ')}
                id={tabId}
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={renderPanel ? panelId : undefined}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => selectValue(item.value)}
                onKeyDown={(event) => onKeyDown(event, item.value)}
              >
                {item.iconStart && <span className="tab-line__icon" aria-hidden="true">{item.iconStart}</span>}
                <span>{item.label}</span>
                {item.iconEnd && <span className="tab-line__icon" aria-hidden="true">{item.iconEnd}</span>}
              </button>
            );
          })}
        </div>
      </div>
      {renderPanel && selectedItem && <div className="tab-line__panel" id={panelId} role="tabpanel" aria-labelledby={`${generatedId}-${selectedItem.value}-tab`}>{renderPanel(selectedItem)}</div>}
    </div>
  );
}
