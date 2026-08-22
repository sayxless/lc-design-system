# L-Charge design system

Основа дизайн-системы для интерактивных React-прототипов.

## Токены

`src/styles/tokens.css` — перенос экспортированных из Figma цветовых, размерных и текстовых токенов в CSS custom properties. Компоненты должны использовать только эти переменные, а не произвольные значения.

`src/styles/typography.css` — классы текстовых стилей. Они повторяют уровни из Figma: `type-heading-2xl` … `type-heading-xs` и `type-text-lg` … `type-text-xs`; нужный вес задаётся классом `type-regular`, `type-medium` или `type-semibold`.

Экспорт содержит семейство `Inter`. Перед запуском приложения следует подключить Inter (предпочтительно `.woff2`) либо временно использовать системный fallback из `--font-sans`.

## Следующий этап

Первый компонент уже находится в `src/components/Button`.

```tsx
import { Button } from './components/Button';

<Button variant="primary" size="md">Создать</Button>
<Button variant="secondary" startIcon={<PlusIcon />}>Добавить</Button>
<Button iconOnly aria-label="Закрыть" startIcon={<CloseIcon />} />
<Button variant="destructive" loading>Удалить</Button>
```

Доступные варианты: `primary`, `secondary`, `tertiary`, `destructive`, `destructive-outline`; размеры: `sm`, `md`, `lg`.

Следующими можно добавить `Input`, `Badge`, `Card` и `Dialog`.
