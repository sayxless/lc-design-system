import { useState } from 'react';

import { Button, type ButtonSize, type ButtonVariant } from './components/Button';
import { Checkbox } from './components/Checkbox';
import { Radio } from './components/Radio';
import { SegmentedControl } from './components/SegmentedControl';
import { Select } from './components/Select';
import { TextInput } from './components/TextInput';
import { Textarea } from './components/Textarea';
import colorsCore from '../tokens/figma/colors-core.tokens.json';
import colorsData from '../tokens/figma/colors-data.tokens.json';
import semanticColors from '../tokens/figma/semantic.tokens.json';
import textStylesData from '../tokens/figma/text-styles.json';

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
  const [message, setMessage] = useState('Готово к проверке');
  const genericIcon = <span className="generic-icon">+</span>;
  const iconProps = iconPosition === 'start'
    ? { startIcon: genericIcon }
    : iconPosition === 'end'
      ? { endIcon: genericIcon }
      : {};

  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <header className="topbar">
        <div className="topbar__inner">
          <p className="topbar__eyebrow">L-CHARGE</p>
          <p className="topbar__title">Design system</p>
        </div>
      </header>

      <main id="main-content" className="layout">
        <section className="intro" aria-labelledby="page-title">
          <p className="section-kicker">Component playground</p>
          <h1 id="page-title" className="type-heading-2xl">Витрина компонентов</h1>
          <p className="intro__description type-text-lg type-regular">
            Рабочая среда для просмотра состояний, вариантов и поведения компонентов перед использованием в прототипах.
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
            <div className="playground__controls" aria-label="Настройки кнопки">
              <Select label="Вариант" value={variant} onValueChange={(value) => setVariant(value as ButtonVariant)} options={variants.map((item) => ({ value: item, label: item }))} />
              <Select label="Размер" value={size} onValueChange={(value) => setSize(value as ButtonSize)} options={sizes.map((item) => ({ value: item, label: item }))} />
              <Select label="Иконка" value={iconPosition} onValueChange={(value) => setIconPosition(value as IconPosition)} options={[{ value: 'none', label: 'Без иконки' }, { value: 'start', label: 'Слева' }, { value: 'end', label: 'Справа' }]} />
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
                onClick={() => setMessage(`Нажата кнопка ${variant} / ${size}`)}
              >
                Сохранить изменения
              </Button>
              <p className="preview-message type-text-sm type-regular" role="status">{message}</p>
            </div>
          </div>

          <div className="variant-grid" aria-label="Все варианты кнопки">
            {variants.map((item) => (
              <article className="variant-card" key={item}>
                <p className="variant-card__label type-text-sm type-medium">{item}</p>
                <Button variant={item}>Button</Button>
                <Button variant={item} disabled>Disabled</Button>
              </article>
            ))}
          </div>

          <div className="icon-examples" aria-label="Варианты расположения иконки">
            <p className="icon-examples__label type-text-sm type-medium">Расположение иконки</p>
            <div className="icon-examples__buttons">
              <Button variant="secondary">Без иконки</Button>
              <Button variant="secondary" startIcon={genericIcon}>Иконка слева</Button>
              <Button variant="secondary" endIcon={genericIcon}>Иконка справа</Button>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="segmented-control-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">02 / Components</p>
              <h2 id="segmented-control-title" className="type-heading-xl">Segmented control</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Один выбранный сегмент</p>
          </div>
          <div className="segmented-showcase">
            <SegmentedControl
              aria-label="Режим отображения"
              value={segment}
              onValueChange={setSegment}
              options={[
                { value: 'overview', label: 'Без иконки' },
                { value: 'start-icon', label: 'Иконка до', iconStart: genericIcon },
                { value: 'end-icon', label: 'Иконка после', iconEnd: genericIcon },
                { value: 'badge', label: 'Со счётчиком', badge: '12' },
                { value: 'start-icon-badge', label: 'Иконка и счётчик', iconStart: genericIcon, badge: '12' },
              ]}
            />
            <p className="preview-message type-text-sm type-regular" role="status">Выбрано: {segment}</p>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="selection-controls-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">03 / Components</p>
              <h2 id="selection-controls-title" className="type-heading-xl">Checkbox и Radio</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Нативные формы, стилизованные по Figma</p>
          </div>
          <div className="selection-grid">
            <section className="selection-panel" aria-labelledby="checkbox-title">
              <h3 id="checkbox-title" className="type-heading-md">Checkbox</h3>
              <div className="selection-stack">
                <Checkbox checked={notifications} onChange={(event) => setNotifications(event.target.checked)} label="Получать уведомления" />
                <Checkbox indeterminate checked={false} label="Выбрана часть пунктов" />
                <Checkbox error label="Подтвердите условия" />
                <Checkbox disabled checked label="Недоступная опция" />
              </div>
            </section>
            <fieldset className="selection-panel">
              <legend className="type-heading-md">Radio</legend>
              <div className="selection-stack">
                <Radio name="plan" value="starter" checked={plan === 'starter'} onChange={(event) => setPlan(event.target.value)} label="Starter" />
                <Radio name="plan" value="business" checked={plan === 'business'} onChange={(event) => setPlan(event.target.value)} size="md" label="Business" />
                <Radio name="plan" value="enterprise" checked={plan === 'enterprise'} onChange={(event) => setPlan(event.target.value)} size="lg" label="Enterprise" />
                <Radio disabled label="Недоступный вариант" />
                <Radio error label="Вариант с ошибкой" />
              </div>
            </fieldset>
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="text-input-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">04 / Components</p>
              <h2 id="text-input-title" className="type-heading-xl">Text input</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Нативное текстовое поле</p>
          </div>
          <div className="text-input-showcase">
            <TextInput
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              hint="Используем только для демонстрации прототипа"
              type="email"
            />
            <TextInput label="Название проекта" required placeholder="Введите название" />
            <TextInput label="Описание" optional defaultValue="L-Charge design system" endIcon={<span className="generic-icon">+</span>} />
            <TextInput label="Email" error errorMessage="Введите корректный email" defaultValue="hello@" />
            <TextInput label="Недоступное поле" disabled defaultValue="Сейчас недоступно" />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="select-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">05 / Components</p>
              <h2 id="select-title" className="type-heading-xl">Select</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Нативный список с Figma-шевроном</p>
          </div>
          <div className="select-showcase">
            <Select label="Страна" value={country} onValueChange={setCountry} hint="Список стилизован по компоненту Figma" options={[{ value: 'es', label: 'Испания' }, { value: 'pt', label: 'Португалия' }, { value: 'fr', label: 'Франция' }]} />
            <Select label="Тип зарядки" required placeholder="Выберите вариант" options={[{ value: 'ac', label: 'AC' }, { value: 'dc', label: 'DC' }]} />
            <Select label="Тариф" optional defaultValue="business" options={[{ value: 'starter', label: 'Starter' }, { value: 'business', label: 'Business' }, { value: 'enterprise', label: 'Enterprise' }]} />
            <Select label="Регион" error placeholder="Выберите регион" errorMessage="Нужно выбрать регион" options={[{ value: 'madrid', label: 'Мадрид' }, { value: 'barcelona', label: 'Барселона' }]} />
            <Select label="Недоступный список" disabled defaultValue="es" options={[{ value: 'es', label: 'Испания' }]} />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="textarea-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">06 / Components</p>
              <h2 id="textarea-title" className="type-heading-xl">Textarea</h2>
            </div>
            <p className="type-text-sm type-regular section-heading__note">Нативное многострочное поле</p>
          </div>
          <div className="textarea-showcase">
            <Textarea label="Комментарий" placeholder="Добавьте комментарий" hint="До 500 символов" />
            <Textarea label="Описание" optional defaultValue="Краткое описание для рабочего прототипа." />
            <Textarea label="Причина" error placeholder="Опишите причину" errorMessage="Заполните это поле" />
            <Textarea label="Недоступное поле" disabled defaultValue="Редактирование недоступно" />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="typography-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">07 / Foundations</p>
              <h2 id="typography-title" className="type-heading-xl">Шкала текста</h2>
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
                  {style.name.includes('heading') ? 'Заголовок интерфейса' : 'Текст интерфейса'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="tokens-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">08 / Foundations</p>
              <h2 id="tokens-title" className="type-heading-xl">Цветовые токены</h2>
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
      </main>
    </>
  );
}
