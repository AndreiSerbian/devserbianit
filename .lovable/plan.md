## Проблема
В Hero-блоке (`src/components/Hero.tsx`) стоит ссылка `https://t.me/your_username` — это явно заглушка, не ваш Telegram.

## Что нужно сделать
1. **Hero.tsx** — заменить `https://t.me/your_username` на `https://t.me/public_serb`.
2. **Повторная проверка** — убедиться, что больше нигде на сайте нет чужих/заглушечных ссылок на Telegram.

## Текущее состояние
- `src/pages/Index.tsx:236` — уже стоит правильная ссылка `https://t.me/public_serb`.
- `src/components/Hero.tsx:129` — стоит неправильная `https://t.me/your_username`.
- Других прямых ссылок `t.me/` (кроме кнопки "Поделиться в Telegram" в калькуляторе) в коде не обнаружено.

После правки обе кнопки "Telegram" на сайте будут вести на ваш аккаунт @public_serb.