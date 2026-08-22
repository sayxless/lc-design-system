# LC Design System

Основа дизайн-системы для интерактивных React-прототипов LC.

## Запуск витрины

```bash
npm install
npm run dev
```

## Токены

`src/styles/tokens.css` переносит экспортированные из Figma цветовые, размерные и текстовые токены в CSS custom properties. Компоненты используют эти переменные, а не произвольные значения.

`src/styles/typography.css` содержит классы текстовых стилей: `type-heading-2xl` … `type-heading-xs` и `type-text-lg` … `type-text-xs`.

## Компоненты

`Button`, `Checkbox`, `Radio`, `SegmentedControl`, `TextInput`, `Select` и `Textarea` находятся в `src/components`. Их рабочие варианты и состояния собраны в локальной витрине.
