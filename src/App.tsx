import { useMemo, useRef, useState } from 'react';

import { Button, type ButtonSize, type ButtonVariant } from './components/Button';
import { Checkbox } from './components/Checkbox';
import { DataTable, type DataTableColumn, type TableSort } from './components/DataTable';
import { DropdownMenu, type DropdownMenuItem } from './components/DropdownMenu';
import { Icon } from './components/Icon';
import { Link } from './components/Link';
import { Modal } from './components/Modal';
import { Radio } from './components/Radio';
import { SegmentedControl } from './components/SegmentedControl';
import { Select } from './components/Select';
import { TextInput } from './components/TextInput';
import { Textarea } from './components/Textarea';
import { TabLine } from './components/TabLine';
import { TabPills } from './components/TabPills';
import { Toggle } from './components/Toggle';
import { Timeline } from './components/Timeline';
import colorsCore from '../tokens/figma/colors-core.tokens.json';
import colorsData from '../tokens/figma/colors-data.tokens.json';
import semanticColors from '../tokens/figma/semantic.tokens.json';
import textStylesData from '../tokens/figma/text-styles.json';
import chevronDown from './assets/figma/select-chevron-down.svg';

const variants: ButtonVariant[] = [
  'primary',
  'secondary',
  'tertiary',
  'destructive',
  'destructive-outline',
];

const sizes: ButtonSize[] = ['sm', 'md', 'lg'];
type IconPosition = 'none' | 'start' | 'end';
type ColorToken = { $type: 'color'; $value: { hex: string; alpha?: number } };
type ColorSwatch = { name: string; hex: string; alpha: number };

type ChargingSession = {
  id: string;
  station: string;
  city: string;
  connector: string;
  status: 'Completed' | 'Charging in progress' | 'Payment pending';
  amount: string;
  startedAt: string;
  duration: string;
  customer: string;
  energy: string;
};

const chargingSessions: ChargingSession[] = [
  { id: 'S-10482', station: 'L-Charge Hub A12', city: 'Madrid', connector: 'CCS 2 · 120 kW', status: 'Charging in progress', amount: '€ 18.40', startedAt: 'Today, 12:40', duration: '00:38', customer: 'María González', energy: '31.2 kWh' },
  { id: 'S-10481', station: 'L-Charge Hub B07', city: 'Barcelona', connector: 'Type 2 · 22 kW', status: 'Completed', amount: '€ 6.80', startedAt: 'Today, 11:15', duration: '01:04', customer: 'Daniel López', energy: '18.6 kWh' },
  { id: 'S-10480', station: 'L-Charge Hub A12', city: 'Madrid', connector: 'CCS 2 · 120 kW', status: 'Payment pending', amount: '€ 24.10', startedAt: 'Today, 10:42', duration: '00:47', customer: 'Sofía Martín', energy: '40.8 kWh' },
  { id: 'S-10479', station: 'L-Charge Hub C03', city: 'Valencia', connector: 'CHAdeMO · 50 kW', status: 'Completed', amount: '€ 12.30', startedAt: 'Yesterday, 18:24', duration: '00:51', customer: 'Carlos Ruiz', energy: '26.9 kWh' },
];

const tableColumns: DataTableColumn<ChargingSession>[] = [
  { key: 'station', header: 'Station', cell: (row) => <span className="table-primary-cell">{row.station}<span>{row.city}</span></span>, minWidth: 210, sortable: true },
  { key: 'connector', header: 'Connector', cell: (row) => row.connector, minWidth: 160 },
  { key: 'status', header: 'Status', cell: (row) => <span className={`table-status table-status--${row.status === 'Completed' ? 'done' : row.status === 'Charging in progress' ? 'active' : 'pending'}`}><span aria-hidden="true" />{row.status}</span>, minWidth: 150, sortable: true },
  { key: 'startedAt', header: 'Started', cell: (row) => row.startedAt, minWidth: 150, sortable: true },
  { key: 'duration', header: 'Duration', cell: (row) => row.duration, align: 'end', minWidth: 120 },
  { key: 'amount', header: 'Amount', cell: (row) => row.amount, align: 'end', minWidth: 96, sortable: true },
];

const dropdownItems: DropdownMenuItem[] = [
  { id: 'manufacturers', label: 'Manufacturers' },
  { id: 'models', label: 'Models' },
  { id: 'rates', label: 'Rates' },
  { id: 'countries', label: 'Countries' },
  { id: 'charger-models', label: 'Charging station models' },
];

function isColorToken(value: unknown): value is ColorToken {
  return Boolean(
    value
      && typeof value === 'object'
      && '$type' in value
      && '$value' in value
      && (value as ColorToken).$type === 'color'
      && typeof (value as ColorToken).$value?.hex === 'string',
  );
}

function flattenColors(value: unknown, path: string[] = []): ColorSwatch[] {
  if (isColorToken(value)) {
    return [{ name: path.join(' / '), hex: value.$value.hex, alpha: value.$value.alpha ?? 1 }];
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => (
    key.startsWith('$') ? [] : flattenColors(child, [...path, key])
  ));
}

const colorCollections = [
  { name: 'Core', tokens: flattenColors(colorsCore) },
  { name: 'Data', tokens: flattenColors(colorsData) },
  { name: 'Semantic', tokens: flattenColors(semanticColors) },
];

function getTextStyleClass(name: string) {
  const heading = name.match(/heading (2xl|xl|lg|md|sm|xs)/i);
  if (heading) return `type-heading-${heading[1].toLowerCase()}`;

  const text = name.match(/text (lg|md|sm|xs) (600|500|400)/i);
  if (!text) return '';

  const weight = { 600: 'semibold', 500: 'medium', 400: 'regular' }[text[2] as '400' | '500' | '600'];
  return `type-text-${text[1].toLowerCase()} type-${weight}`;
}

export function App() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [iconPosition, setIconPosition] = useState<IconPosition>('none');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('starter');
  const [segment, setSegment] = useState('overview');
  const [email, setEmail] = useState('hello@l-charge.com');
  const [country, setCountry] = useState('es');
  const [message, setMessage] = useState('Ready for review');
  const [tableSort, setTableSort] = useState<TableSort>();
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>(['S-10481']);
  const [expandedSessionIds, setExpandedSessionIds] = useState<string[]>(['S-10482']);
  const [dropdownMessage, setDropdownMessage] = useState('Choose an action');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('Dialog has not been opened yet');
  const [tabLineValue, setTabLineValue] = useState('sessions');
  const [tabPillsValue, setTabPillsValue] = useState('all');
  const [smartCharging, setSmartCharging] = useState(true);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);
  const genericIcon = <Icon name="triangle" size="md" />;
  const iconProps = iconPosition === 'start'
    ? { startIcon: genericIcon }
    : iconPosition === 'end'
      ? { endIcon: genericIcon }
      : {};
  const sortedSessions = useMemo(() => {
    if (!tableSort) return chargingSessions;
    return [...chargingSessions].sort((a, b) => {
      const result = tableSort.columnKey === 'amount'
        ? Number(a.amount.replace(/[^0-9,]/g, '').replace(',', '.')) - Number(b.amount.replace(/[^0-9,]/g, '').replace(',', '.'))
        : (tableSort.columnKey === 'station' ? a.station : tableSort.columnKey === 'startedAt' ? a.startedAt : a.status).localeCompare(tableSort.columnKey === 'station' ? b.station : tableSort.columnKey === 'startedAt' ? b.startedAt : b.status, 'ru');
      return tableSort.direction === 'ascending' ? result : -result;
    });
  }, [tableSort]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <div className="topbar__inner">
          <p className="topbar__eyebrow">L-CHARGE</p>
          <p className="topbar__title">Design system</p>
        </div>
      </header>

      <main id="main-content" className="layout">
        <aside className="sidebar" aria-label="Showcase navigation">
          <nav className="sidebar__nav">
            <div className="sidebar__group">
              <p className="sidebar__title">Components</p>
              <a href="#button-title">Button</a>
              <a href="#selection-controls-title">Checkbox &amp; Radio</a>
              <a href="#data-table-title">Data table</a>
              <a href="#dropdown-menu-title">Dropdown menu</a>
              <a href="#icon-title">Icon</a>
              <a href="#link-title">Link</a>
              <a href="#modal-title">Modal</a>
              <a href="#segmented-control-title">Segmented control</a>
              <a href="#select-title">Select</a>
              <a href="#tab-line-title">Tab line</a>
              <a href="#tab-pills-title">Tab pills</a>
              <a href="#text-input-title">Text input</a>
              <a href="#textarea-title">Textarea</a>
              <a href="#timeline-title">Timeline</a>
              <a href="#toggle-title">Toggle</a>
            </div>
            <div className="sidebar__group">
              <p className="sidebar__title">Foundations</p>
              <a href="#tokens-title">Colors</a>
              <a href="#typography-title">Text styles</a>
            </div>
          </nav>
        </aside>

        <div className="showcase-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="section-kicker">Component playground</p>
          <h1 id="page-title" className="type-heading-2xl">Component showcase</h1>
          <p className="intro__description type-text-lg type-regular">
            A working environment for reviewing component states, variants, and behaviour before using them in prototypes.
          </p>
        </section>

        <section className="showcase-section" aria-labelledby="button-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">01 / Components</p>
              <h2 id="button-title" className="type-heading-xl">Button</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Figma: Buttons</p>
          </div>

          <div className="playground">
            <div className="playground__controls" aria-label="Button settings">
              <Select label="Variant" value={variant} onValueChange={(value) => setVariant(value as ButtonVariant)} options={variants.map((item) => ({ value: item, label: item }))} />
              <Select label="Size" value={size} onValueChange={(value) => setSize(value as ButtonSize)} options={sizes.map((item) => ({ value: item, label: item }))} />
              <Select label="Icon" value={iconPosition} onValueChange={(value) => setIconPosition(value as IconPosition)} options={[{ value: 'none', label: 'No icon' }, { value: 'start', label: 'Start' }, { value: 'end', label: 'End' }]} />
              <Checkbox checked={loading} onChange={(event) => setLoading(event.target.checked)} label="Loading" />
              <Checkbox checked={disabled} onChange={(event) => setDisabled(event.target.checked)} label="Disabled" />
            </div>

            <div className="playground__preview">
              <p className="preview-label type-text-xs type-medium">Live preview</p>
              <Button
                variant={variant}
                size={size}
                loading={loading}
                disabled={disabled}
                {...iconProps}
                onClick={() => setMessage(`Button pressed: ${variant} / ${size}`)}
              >
                Save changes
              </Button>
              <p className="preview-message type-text-sm type-regular" role="status">{message}</p>
            </div>
          </div>

          <div className="variant-grid" aria-label="All button variants">
            {variants.map((item) => (
              <article className="variant-card" key={item}>
                <p className="variant-card__label type-text-sm type-medium">{item}</p>
                <Button variant={item}>Button</Button>
                <Button variant={item} disabled>Disabled</Button>
              </article>
            ))}
          </div>

          <div className="icon-examples" aria-label="Icon placement variants">
            <p className="icon-examples__label type-text-sm type-medium">Icon placement</p>
            <div className="icon-examples__buttons">
              <Button variant="secondary">No icon</Button>
              <Button variant="secondary" startIcon={genericIcon}>Start icon</Button>
              <Button variant="secondary" endIcon={genericIcon}>End icon</Button>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="segmented-control-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">08 / Components</p>
              <h2 id="segmented-control-title" className="type-heading-xl">Segmented control</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">One selected segment</p>
          </div>
          <div className="segmented-showcase">
            <SegmentedControl
              aria-label="Display mode"
              value={segment}
              onValueChange={setSegment}
              options={[
                { value: 'overview', label: 'No icon' },
                { value: 'start-icon', label: 'Start icon', iconStart: genericIcon },
                { value: 'end-icon', label: 'End icon', iconEnd: genericIcon },
                { value: 'badge', label: 'With count', badge: '12' },
                { value: 'start-icon-badge', label: 'Icon and count', iconStart: genericIcon, badge: '12' },
              ]}
            />
            <p className="preview-message type-text-sm type-regular" role="status">Selected: {segment}</p>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="selection-controls-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">02 / Components</p>
              <h2 id="selection-controls-title" className="type-heading-xl">Checkbox &amp; Radio</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Native controls styled after Figma</p>
          </div>
          <div className="selection-grid">
            <section className="selection-panel" aria-labelledby="checkbox-title">
              <h3 id="checkbox-title" className="type-heading-md">Checkbox</h3>
              <div className="selection-stack">
                <Checkbox checked={notifications} onChange={(event) => setNotifications(event.target.checked)} label="Receive notifications" />
                <Checkbox indeterminate checked={false} label="Some items selected" />
                <Checkbox error label="Accept terms" />
                <Checkbox disabled checked label="Unavailable option" />
              </div>
            </section>
            <fieldset className="selection-panel">
              <legend className="type-heading-md">Radio</legend>
              <div className="selection-stack">
                <Radio name="plan" value="starter" checked={plan === 'starter'} onChange={(event) => setPlan(event.target.value)} label="Starter" />
                <Radio name="plan" value="business" checked={plan === 'business'} onChange={(event) => setPlan(event.target.value)} size="md" label="Business" />
                <Radio name="plan" value="enterprise" checked={plan === 'enterprise'} onChange={(event) => setPlan(event.target.value)} size="lg" label="Enterprise" />
                <Radio disabled label="Unavailable option" />
                <Radio error label="Option with an error" />
              </div>
            </fieldset>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="text-input-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">12 / Components</p>
              <h2 id="text-input-title" className="type-heading-xl">Text input</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Native text field</p>
          </div>
          <div className="text-input-showcase">
            <TextInput
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              hint="Used for prototype demonstration only"
              type="email"
            />
            <TextInput label="Project name" required placeholder="Enter a name" />
            <TextInput label="Description" optional defaultValue="L-Charge design system" endIcon={genericIcon} />
            <TextInput label="Email" error errorMessage="Enter a valid email" defaultValue="hello@" />
            <TextInput label="Unavailable field" disabled defaultValue="Currently unavailable" />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="select-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">09 / Components</p>
              <h2 id="select-title" className="type-heading-xl">Select</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Native list with a Figma chevron</p>
          </div>
          <div className="select-showcase">
            <Select label="Country" value={country} onValueChange={setCountry} hint="List styled after the Figma component" options={[{ value: 'es', label: 'Spain' }, { value: 'pt', label: 'Portugal' }, { value: 'fr', label: 'France' }]} />
            <Select label="Charging type" required placeholder="Choose an option" options={[{ value: 'ac', label: 'AC' }, { value: 'dc', label: 'DC' }]} />
            <Select label="Plan" optional defaultValue="business" options={[{ value: 'starter', label: 'Starter' }, { value: 'business', label: 'Business' }, { value: 'enterprise', label: 'Enterprise' }]} />
            <Select label="Region" error placeholder="Choose a region" errorMessage="Select a region" options={[{ value: 'madrid', label: 'Madrid' }, { value: 'barcelona', label: 'Barcelona' }]} />
            <Select label="Unavailable list" disabled defaultValue="es" options={[{ value: 'es', label: 'Spain' }]} />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="textarea-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">13 / Components</p>
              <h2 id="textarea-title" className="type-heading-xl">Textarea</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Native multiline field</p>
          </div>
          <div className="textarea-showcase">
            <Textarea label="Comment" placeholder="Add a comment" hint="Up to 500 characters" />
            <Textarea label="Description" optional defaultValue="A short description for the working prototype." />
            <Textarea label="Reason" error placeholder="Describe the reason" errorMessage="Complete this field" />
            <Textarea label="Unavailable field" disabled defaultValue="Editing is unavailable" />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="link-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">06 / Components</p>
              <h2 id="link-title" className="type-heading-xl">Link</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Semantic link with icons</p>
          </div>
          <div className="link-showcase">
            <Link href="#link-without-icon">No icon</Link>
            <Link href="#link-start-icon" startIcon={<Icon name="triangle" size="md" />}>Start icon</Link>
            <Link href="#link-end-icon" endIcon={<Icon name="triangle" size="md" />}>End icon</Link>
            <Link href="#link-medium" medium>Medium link</Link>
            <Link href="#link-disabled" disabled>Disabled link</Link>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="data-table-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">03 / Components</p>
              <h2 id="data-table-title" className="type-heading-xl">Data table</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Selection, sorting, and row details</p>
          </div>
          <div className="table-showcase">
            <DataTable
              caption="Charging sessions"
              columns={tableColumns}
              data={sortedSessions}
              minWidth={1360}
              getRowId={(row) => row.id}
              sort={tableSort}
              onSortChange={setTableSort}
              selectedRowIds={selectedSessionIds}
              onSelectionChange={setSelectedSessionIds}
              expandedRowIds={expandedSessionIds}
              onExpandedChange={setExpandedSessionIds}
              renderExpandedRow={(row) => (
                <div className="table-details">
                  <div><p>Session</p><strong>{row.id}</strong><span>{row.startedAt} · {row.duration}</span></div>
                  <div><p>Customer</p><strong>{row.customer}</strong><span>{row.energy}</span></div>
                  <div><p>Payment</p><strong>{row.amount}</strong><span>{row.status}</span></div>
                </div>
              )}
            />
            <p className="table-showcase__note type-text-sm type-regular" role="status">
              Selected rows: {selectedSessionIds.length}. Use the chevron to open details.
            </p>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="dropdown-menu-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">04 / Components</p>
              <h2 id="dropdown-menu-title" className="type-heading-xl">Dropdown menu</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Action menu opened by a button</p>
          </div>
          <div className="dropdown-showcase">
            <DropdownMenu
              trigger={<Button variant="secondary" endIcon={<span className="dropdown-trigger-chevron"><img src={chevronDown} alt="" /></span>}>Actions</Button>}
              items={dropdownItems}
              onAction={(item) => setDropdownMessage(`Selected: ${String(item.label)}`)}
            />
            <p className="preview-message type-text-sm type-regular" role="status">{dropdownMessage}</p>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="modal-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">07 / Components</p>
              <h2 id="modal-title" className="type-heading-xl">Modal</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Confirmation dialog with focus management</p>
          </div>
          <div className="modal-showcase">
            <Button ref={modalTriggerRef} variant="secondary" onClick={() => { setModalMessage('Dialog opened'); setModalOpen(true); }}>Open dialog</Button>
            <p className="preview-message type-text-sm type-regular" role="status">{modalMessage}</p>
          </div>
          <Modal
            open={modalOpen}
            onOpenChange={(open) => { setModalOpen(open); if (!open) setModalMessage('Dialog closed'); }}
            title="Delete charging session?"
            size="sm"
            restoreFocusRef={modalTriggerRef}
            actions={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { setModalMessage('Session deleted'); setModalOpen(false); }}>Delete</Button></>}
          >
            <p>Session S-10482 will be permanently deleted.</p>
          </Modal>
        </section>

        <section className="showcase-section" aria-labelledby="tab-line-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">10 / Components</p>
              <h2 id="tab-line-title" className="type-heading-xl">Tab line</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Line tabs with a switchable panel</p>
          </div>
          <div className="tab-line-showcase">
            <TabLine
              ariaLabel="Management sections"
              value={tabLineValue}
              onValueChange={setTabLineValue}
              items={[
                { value: 'sessions', label: 'Charging sessions', iconStart: genericIcon },
                { value: 'vehicles', label: 'Vehicles' },
                { value: 'staff', label: 'Staff', iconEnd: genericIcon },
                { value: 'archive', label: 'Archive', disabled: true },
              ]}
              renderPanel={(item) => <p className="tab-line-showcase__panel type-text-md type-regular">Open section: {item.label}</p>}
            />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="tab-pills-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">11 / Components</p>
              <h2 id="tab-pills-title" className="type-heading-xl">Tab pills</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Compact tabs with a selected state</p>
          </div>
          <div className="tab-pills-showcase">
            <TabPills
              ariaLabel="Charging session status"
              value={tabPillsValue}
              onValueChange={setTabPillsValue}
              items={[
                { value: 'all', label: 'All', badge: '24', iconStart: genericIcon },
                { value: 'active', label: 'Active', badge: '3' },
                { value: 'completed', label: 'Completed', badge: '18', iconEnd: genericIcon },
                { value: 'archive', label: 'Archive', disabled: true },
              ]}
              renderPanel={(item) => <p className="tab-pills-showcase__panel type-text-md type-regular">Selected group: {item.label}</p>}
            />
            <TabPills
              ariaLabel="Compact tabs"
              size="sm"
              defaultValue="new"
              items={[
                { value: 'new', label: 'New', badge: '12' },
                { value: 'review', label: 'In review', badge: '4' },
                { value: 'done', label: 'Done', badge: '30' },
              ]}
            />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="toggle-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">15 / Components</p>
              <h2 id="toggle-title" className="type-heading-xl">Toggle</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Native switch with sizes and labels</p>
          </div>
          <div className="toggle-showcase">
            <article className="toggle-example"><p className="type-text-sm type-medium">Labels on both sides</p><Toggle size="sm" labelStart="Off" labelEnd="On" defaultChecked /></article>
            <article className="toggle-example"><p className="type-text-sm type-medium">Start label only</p><Toggle size="md" labelStart="Smart charging" checked={smartCharging} onChange={(event) => setSmartCharging(event.target.checked)} /></article>
            <article className="toggle-example"><p className="type-text-sm type-medium">End label only</p><Toggle size="lg" labelEnd="Public station" defaultChecked /></article>
            <article className="toggle-example"><p className="type-text-sm type-medium">Disabled</p><Toggle size="md" labelEnd="Unavailable toggle" disabled checked /></article>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="timeline-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">14 / Components</p>
              <h2 id="timeline-title" className="type-heading-xl">Timeline</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Event sequence and loading state</p>
          </div>
          <div className="timeline-showcase">
            <Timeline
              heading="Session history"
              showMoreLabel="Show more"
              onShowMore={() => setMessage('Additional events loaded')}
              items={[
                { id: 'started', title: 'Session started', supportText: 'Today, 12:40' },
                { id: 'connected', title: 'Connector plugged in', supportText: 'CCS 2 · 120 kW' },
                { id: 'charging', title: 'Charging in progress', supportText: '31.2 kWh · 00:38' },
              ]}
            />
            <Timeline heading="Loading history" loading skeletonCount={3} />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="icon-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">05 / Components</p>
              <h2 id="icon-title" className="type-heading-xl">Icon</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">A shared container for local icon-pack assets</p>
          </div>
          <div className="icon-showcase">
            {(['sm', 'md', 'lg', 'custom'] as const).map((iconSize) => (
              <article className="icon-example" key={iconSize}>
                <Icon name="triangle" size={iconSize} />
                <p className="type-text-sm type-medium">{iconSize}</p>
                <span className="type-text-xs type-regular">{iconSize === 'custom' ? '32 px' : `${{ sm: 16, md: 20, lg: 24 }[iconSize]} px`}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="typography-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">17 / Foundations</p>
              <h2 id="typography-title" className="type-heading-xl">Text styles</h2>
            </div>
          </div>
          <div className="type-scale">
            {textStylesData.textStyles.map((style) => (
              <article className="type-sample" key={style.name}>
                <div>
                  <p className="type-sample__name type-text-sm type-medium">{style.name.replace('lagre screen/', '')}</p>
                  <p className="type-sample__meta type-text-xs type-regular">
                    Inter · {style.fontWeight} · {style.fontSize}px
                  </p>
                </div>
                <p className={getTextStyleClass(style.name)}>
                  {style.name.includes('heading') ? 'Interface heading' : 'Interface text'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="tokens-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">16 / Foundations</p>
              <h2 id="tokens-title" className="type-heading-xl">Colors</h2>
            </div>
          </div>
          {colorCollections.map((collection) => (
            <section className="color-collection" key={collection.name} aria-labelledby={`colors-${collection.name}`}>
              <h3 id={`colors-${collection.name}`} className="type-heading-sm">{collection.name}</h3>
              <div className="swatch-grid">
                {collection.tokens.map((token) => (
                  <article className="swatch" key={`${collection.name}-${token.name}`}>
                    <div className="swatch__color" style={{ backgroundColor: token.hex, opacity: token.alpha }} aria-hidden="true" />
                    <div>
                      <p className="type-text-sm type-medium">{token.name}</p>
                      <code>{token.hex}{token.alpha < 1 ? ` · ${Math.round(token.alpha * 100)}%` : ''}</code>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>
        </div>
      </main>
    </>
  );
}
