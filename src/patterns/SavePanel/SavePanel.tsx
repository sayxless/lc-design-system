import type { CSSProperties } from 'react';

import unsavedChangesIcon from '../../assets/figma/save-panel/unsaved-changes.svg';
import { Button } from '../../components/Button';
import './SavePanel.css';

export interface SavePanelProps {
  message?: string;
  resetLabel?: string;
  saveLabel?: string;
  onReset?: () => void;
  onSave?: () => void;
  /** Sidebar width or another inline offset used to center the panel in the work area. */
  workspaceOffset?: number;
  /** Distance from the bottom edge of the viewport. */
  bottomOffset?: number | string;
  className?: string;
}

function toCssLength(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

export function SavePanel({
  message = 'You have unsaved changes',
  resetLabel = 'Reset',
  saveLabel = 'Save changes',
  onReset,
  onSave,
  workspaceOffset = 0,
  bottomOffset = 64,
  className,
}: SavePanelProps) {
  const style = {
    '--save-panel-workspace-center-offset': `${workspaceOffset / 2}px`,
    '--save-panel-bottom-offset': toCssLength(bottomOffset),
  } as CSSProperties;

  return (
    <aside className={['save-panel', className].filter(Boolean).join(' ')} style={style} aria-label="Unsaved changes">
      <div className="save-panel__message"><img src={unsavedChangesIcon} alt="" aria-hidden="true" /><p>{message}</p></div>
      <div className="save-panel__actions"><Button variant="secondary" onClick={onReset}>{resetLabel}</Button><Button onClick={onSave}>{saveLabel}</Button></div>
    </aside>
  );
}
