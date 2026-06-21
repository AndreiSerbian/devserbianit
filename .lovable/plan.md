## Что делаем

### 1. Убрать Email (пока)
В `src/pages/Index.tsx`:
- Удалить кнопку с `mailto:serbiyan012@gmail.com` из блока контактов, оставить только Telegram.
- Убрать неиспользуемый импорт `Mail` из lucide-react.
- Дублирование заявок на почту не подключаем.

### 2. Починить переход в бургер-меню
Проблема подтверждена в превью: при клике по пункту меню страница не прокручивается, т.к. скролл запускается одновременно со сворачиванием меню — разметка сдвигается и плавный скролл сбивается.

В `src/pages/Index.tsx` изменить `scrollToSection` и `scrollToCalculator`: сначала закрывать меню, затем запускать `scrollIntoView` с небольшой задержкой, чтобы разметка успела перестроиться.

```ts
const scrollToSection = (id: string) => {
  setMobileMenuOpen(false);
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, 250);
};
```
Аналогично для `scrollToCalculator`.

### Переводы
Не трогаем — оставляем как есть.

## Файлы
- `src/pages/Index.tsx` — удаление кнопки Email + импорта `Mail`, фикс прокрутки меню.
