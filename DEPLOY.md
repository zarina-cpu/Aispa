# Деплой: Vercel + Turso

## 1. Turso

1. Создайте БД в [Turso](https://turso.tech) (CLI или панель).
2. Получите URL и токен:
   ```bash
   turso db show aispa --url
   turso db tokens create aispa
   ```
3. Локально в `apps/api/.env`:
   ```env
   TURSO_DATABASE_URL=libsql://...
   TURSO_AUTH_TOKEN=...
   ```
4. Примените схему:
   ```bash
   npm run db:migrate
   ```

Таблица `generations` хранит параметры запроса и JSON с вариантами подписей.

## 2. Vercel

1. Импортируйте репозиторий в [Vercel](https://vercel.com).
2. **Root Directory:** корень репозитория (`C:\AI\Aispa` / `.`).
3. Настройки сборки подхватываются из `vercel.json`:
   - статика: `apps/web/dist`
   - API: serverless `api/index.ts` → маршруты `/api/*`

### Переменные окружения (Production)

| Переменная | Описание |
|------------|----------|
| `GOOGLE_API_KEY` | Ключ Gemini |
| `TURSO_DATABASE_URL` | URL libsql из Turso |
| `TURSO_AUTH_TOKEN` | Токен Turso |
| `GEMINI_MODEL` | Опционально, например `gemini-3.5-flash-lite` |

После деплоя проверьте:

- `https://ваш-домен.vercel.app/api/health` → `keyConfigured: true`, `dbConfigured: true`
- Генерация и блок «История (Turso)» на главной

## 3. CLI (опционально)

```bash
npx vercel login
npx vercel --prod
```

Секреты задайте в Vercel Dashboard → Project → Settings → Environment Variables.
