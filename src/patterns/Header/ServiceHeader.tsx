import { useState } from 'react';

import bellIcon from '../../assets/icons/bell.svg';
import chevronIcon from '../../assets/icons/chevron-down-small.svg';
import dotGridIcon from '../../assets/icons/dot grid.svg';
import logo from '../../assets/figma/header/l-charge-partner.svg';
import { Button } from '../../components/Button';
import { DropdownMenu, type DropdownMenuItem } from '../../components/DropdownMenu';
import './ServiceHeader.css';

export interface ServiceHeaderNavItem {
  id: string;
  label: string;
  menuItems?: DropdownMenuItem[];
}

export interface ServiceHeaderProps {
  navItems: ServiceHeaderNavItem[];
  activeItemId?: string;
  defaultActiveItemId?: string;
  onNavigate?: (item: ServiceHeaderNavItem) => void;
  userName?: string;
  companyName?: string;
  initials?: string;
  showControls?: boolean;
  profileMenuItems?: DropdownMenuItem[];
  onProfileAction?: (item: DropdownMenuItem) => void;
  className?: string;
}

export function ServiceHeader({
  navItems,
  activeItemId,
  defaultActiveItemId,
  onNavigate,
  userName = 'Nick Smith',
  companyName = 'Acme Corp',
  initials = 'NS',
  showControls = false,
  profileMenuItems = [],
  onProfileAction,
  className,
}: ServiceHeaderProps) {
  const [uncontrolledActiveItemId, setUncontrolledActiveItemId] = useState(defaultActiveItemId ?? navItems[0]?.id);
  const selectedItemId = activeItemId ?? uncontrolledActiveItemId;

  const selectItem = (item: ServiceHeaderNavItem) => {
    if (activeItemId === undefined) setUncontrolledActiveItemId(item.id);
    onNavigate?.(item);
  };
  const profileContent = <><span className="service-header__avatar" aria-hidden="true">{initials}</span><span className="service-header__identity"><span>{userName}</span><small>{companyName}</small></span><img className="service-header__chevron" src={chevronIcon} alt="" /></>;

  return (
    <header className={['service-header', className].filter(Boolean).join(' ')}>
      <div className="service-header__main">
        <div className="service-header__start">
          <a className="service-header__logo" href="#main-content" aria-label="L-CHARGE home"><img src={logo} alt="L-CHARGE" /></a>
          <nav className="service-header__nav" aria-label="Service navigation">
            {navItems.map((item) => {
              const trigger = <Button variant="tertiary" size="md" className={['service-header__nav-item', item.id === selectedItemId && 'service-header__nav-item--active'].filter(Boolean).join(' ')} onClick={() => selectItem(item)} endIcon={item.menuItems ? <img className="service-header__chevron" src={chevronIcon} alt="" /> : undefined}>{item.label}</Button>;
              return item.menuItems ? <DropdownMenu key={item.id} portal trigger={trigger} items={item.menuItems} onAction={() => selectItem(item)} /> : <span key={item.id}>{trigger}</span>;
            })}
          </nav>
        </div>
        <div className="service-header__end">
          {showControls && <div className="service-header__controls"><button type="button" aria-label="Open apps"><img src={dotGridIcon} alt="" /></button><button type="button" aria-label="Notifications"><img src={bellIcon} alt="" /></button></div>}
          {profileMenuItems.length ? <DropdownMenu align="end" portal trigger={<Button variant="tertiary" size="md" className="service-header__profile" aria-label={`Open profile menu for ${userName}`}>{profileContent}</Button>} items={profileMenuItems} onAction={onProfileAction} /> : <div className="service-header__profile">{profileContent}</div>}
        </div>
      </div>
    </header>
  );
}
