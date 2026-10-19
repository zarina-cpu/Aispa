# SPA Caption Studio

Мини веб-приложение для генерации подписей к фото SPA-салона с помощью Google Gemini. История генераций — в **Turso**; продакшен — **Vercel**.

## Возможности

- Загрузка фото (JPEG, PNG, WebP до 4 МБ) или текстовое описание
- Тональность, длина, эмодзи / хэштеги / CTA
- 4 варианта подписи, копирование и перегенерация
- Светлая и тёмная тема
- История запросов в Turso (если настроены `TURSO_*`)

## Локальный запуск

```bash
npm run install:all
```

`apps/api/.env` (см. `.env.example`):

```env
GOOGLE_API_KEY=...
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
PORT=3001
```

```bash
npm run db:migrate   # один раз после настройки Turso
npm run dev
```

- UI: http://localhost:5173  
- API: http://localhost:3001  

## Сборка

```bash
npm run build
```

## Деплой

Подробно: [DEPLOY.md](./DEPLOY.md) (Vercel + Turso).

## Промпт

Системная инструкция в `apps/api/src/prompts/`.
