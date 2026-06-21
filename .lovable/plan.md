## Цель
Полностью убрать «Кастомную интеграцию» из данных типов проекта, чтобы её не было ни в PDF-смете, ни в тексте Telegram-share.

## Что сделаю

### 1. Удалю запись `integration` из переводов
В `src/data/translations.ts` удаляю ключ `integration` из объекта `types` во всех трёх языках:
- RU (строка 17): `integration: "Кастомная интеграция"`
- EN (строка 149): `integration: "Custom Integration"`
- RO (строка 281): `integration: "Integrare personalizată"`

Так как PDF (строка 143 в `Calculator.tsx`) и Telegram-share (строка 239) берут название через `t.types[projectType]`, после удаления этого ключа интеграция в принципе не сможет попасть в эти данные.

### 2. Уберу `integration` из расчётных часов
В `src/components/Calculator.tsx` удаляю строку `integration: { small: 40, medium: 90, large: 160 }` из `projectHours` (строка 40), чтобы данные были согласованы.

### 3. Уберу теперь лишний фильтр
В `Calculator.tsx` фильтр `.filter(([key]) => key !== "integration")` в списке типов больше не нужен (ключа нет) — упрощаю обратно до обычного `map`.

## Результат
Тип «Кастомная интеграция» полностью отсутствует в выборе, в PDF-смете и в тексте Telegram-share. Значение по умолчанию остаётся `ecommerce`.