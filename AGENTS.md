# SPA Caption Studio — подсказки для агента

Стек: **React (Vite)** + **Express API** + **Gemini** + **Turso** + **Vercel**.

## Skills (установлены в репозитории)

При доработках читай соответствующий `SKILL.md` в `.agents/skills/`:

| Задача | Skill |
|--------|--------|
| Деплой, Git ↔ Vercel, preview/production | `deploy-to-vercel` |
| React: производительность, хуки, структура UI | `vercel-react-best-practices` |
| Композиция компонентов, разбиение формы/результатов | `vercel-composition-patterns` |

Установка заново: `npx skills add vercel-labs/agent-skills@<имя> -y` из корня проекта.

## Проект

- Локально: `npm run dev` (web :5173, api :3001).
- Секреты: `apps/api/.env` (не коммитить).
- Продакшен: https://aispa-caption-studio.vercel.app
- Git: `zarina-cpu/Aispa` → Vercel project `aispa-caption-studio`.
- После изменений в UI/API: push в `main` или `npx vercel --prod` из корня.

## Области кода

- UI: `apps/web/src/`
- API и промпты: `apps/api/src/`
- Serverless entry: `api/index.ts`
- Конфиг деплоя: `vercel.json`
