# AI Agent Project Context

## Project Snapshot
- **Name:** react-admin-dashboard
- **Type:** Frontend admin panel scaffold
- **Framework:** React 19 + TypeScript + Vite
- **Routing:** `react-router` (browser router)
- **State Management:** Zustand (`persist` middleware)
- **Forms & Validation:** React Hook Form + Zod
- **UI System:** Tailwind CSS v4 + shadcn-style primitives + Radix + Lucide icons + Motion
- **HTTP Client:** Axios (configured in `src/lib/config.ts`)

## Source Structure
- `src/main.tsx`: router setup and app entry
- `src/App.tsx`: protected shell (header + sidebar + outlet)
- `src/pages/`: route-level pages (`Login`, `Register`, `DashboardPage`)
- `src/components/ui/`: reusable UI primitives (`Button`, `Card`, `Input`, `Form`, `Label`)
- `src/components/common/`: shared app components (`Header`, `CommonLayout`)
- `src/components/dashboard/`: dashboard-specific components (`Sidebar`)
- `src/layouts/`: layout placeholders (`DashboardLayout`)
- `src/store/useAuthStore.ts`: auth state, login/register/logout, persisted token
- `src/lib/config.ts`: Axios instance, interceptors, endpoint constants
- `src/lib/validation.ts`: Zod schemas for login/register
- `src/index.css`: theme tokens, global styles, utility classes (`hoverEffect`, `.btn`)

## Current Architecture Pattern
- **Pattern:** Feature-light modular structure, currently closer to layered organization than strict feature modules.
- **Data flow:** Page -> form validation -> store action -> API -> persisted auth state -> route guard.
- **Route guard:** In `App.tsx`, unauthenticated users are redirected to `/login`.
- **Auth payload mapping:** Store expects `success`, `token`, `permissions`, `expire_date`, and user in `data` (or fallback `user`).

## API & Auth Conventions
- Base URL comes from `VITE_BASE_URL` and appends `/v1`.
- Auth header is injected from `localStorage` key `auth-storage`.
- Response interceptor clears auth storage and redirects to `/login` on `401`.
- Admin endpoints currently defined:
  - `LOGIN: /login`
  - `REGISTER: /register`
  - `LOGOUT: /logout`

## UI/Design Conventions
- Use existing `src/components/ui/*` primitives first.
- Keep class composition through `cn()` (`clsx` + `tailwind-merge`).
- Continue using token-based colors from CSS variables in `src/index.css`.
- Keep transitions via existing `hoverEffect` utility class.

## Known Gaps / Cautions
1. `Header`, `Sidebar`, `DashboardPage`, and `DashboardLayout` are placeholders.
2. `Register` page currently does not call store registration action.
3. `checkIsAdmin()` logic in `useAuthStore.ts` returns true for `Merchant` role; likely incorrect naming/logic mismatch.
4. `src/index.css` contains duplicate `@import "tailwindcss"` and duplicate `@custom-variant dark` blocks.
5. `README.md` is still default Vite template (project-specific setup is undocumented).

## Agent Rules for Future Changes
- Keep edits minimal and scoped to requested feature.
- Reuse existing stack (Zustand, RHF, Zod, Axios, shadcn primitives).
- Avoid introducing alternative state/form/http libraries unless explicitly requested.
- For auth-dependent features, read permissions from `useAuthStore` and guard at route and UI levels.
- Update docs when you change architecture, env vars, or API contracts.

## Fast Start Commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Preview: `pnpm preview`

## Recommended Next Implementation Sequence
1. Complete `Register` submit flow with API/store integration.
2. Implement actual `Header` and `Sidebar` navigation from permissions.
3. Move route protection into reusable protected-route/layout pattern.
4. Add typed API response models in `src/lib` for consistency.
5. Add error/toast UX for auth failures and loading states.
