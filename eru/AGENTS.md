# AGENTS.md — Eru Repository Guidelines

## Tech Stack

React 19 + TypeScript + Vite · Ant Design 6 · Axios · React Router 7 · React Hook Form + Zod · Redux

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (port 4242, host 0.0.0.0) |
| `pnpm build` | Type check (`tsc -b`) then production build |
| `pnpm lint` | Run ESLint on all source files |
| `pnpm preview` | Preview production build locally |

**Note:** No test framework is configured. Do not add tests unless explicitly requested.

## Project Structure

```
src/
├── api/              # API client modules (axios wrappers, typed request functions)
│   ├── request.ts    # Axios instance with interceptors (auth token, error handling)
│   ├── account/      # Login & register API functions
│   └── profile/      # Profile CRUD API functions
├── components/       # Reusable UI components (organized by domain)
├── contexts/         # React context providers
├── features/         # Feature modules (currently empty, reserved for Redux slices)
├── pages/            # Route-level page components
├── routers/          # Route configuration (if extracted from App.tsx)
├── utils/            # Shared utilities (hash_crypto, AuthGuard)
├── App.tsx           # Root component with BrowserRouter + Routes
└── main.tsx          # Entry point (StrictMode + createRoot)
```

## Code Style

### Imports
- Use relative imports only (no path aliases configured).
- Group imports: external libraries → internal modules → CSS.
- Default import React components; named import types/hooks/utilities.

### TypeScript
- **Strict mode** is enabled. Do not suppress type errors with `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Use `interface` for object shapes (props, API params/responses).
- Use `type` for unions, intersections, and utility types.
- `verbatimModuleSyntax` is enabled — import/export type syntax must be explicit.
- `noUnusedLocals` and `noUnusedParameters` are enforced.

### Components
- Functional components only. Use arrow function or `const` declarations.
- Export pages/components as **default**; export types/interfaces as **named**.
- Page components in `src/pages/` should be thin wrappers delegating to `src/components/`.
- Use CSS Modules for component-scoped styles (`*.module.css`).

### Naming Conventions
| Entity | Convention | Example |
|--------|------------|---------|
| Components | PascalCase | `LoginForm`, `Counter` |
| Pages | PascalCase | `Login`, `Register` |
| API functions | camelCase with verb prefix | `postLogin`, `getProfileInfo` |
| Types/Interfaces | PascalCase | `LoginParams`, `ProfileInfo` |
| Utilities | camelCase / snake_case | `hash_crypto` |
| CSS modules | camelCase classes | `.sidebar`, `.active` |

### Error Handling
- API errors are handled globally via axios response interceptor (`message.error` from Ant Design).
- Client-side validation in API functions returns `Promise.reject(new Error(...))` with Chinese messages.
- Do not add empty `catch` blocks. Always handle or propagate errors.

### API Layer
- All HTTP requests go through the shared `request` instance (`src/api/request.ts`).
- Auth token is auto-attached from `localStorage` via request interceptor.
- API functions should be typed with explicit `Params` and `Response` interfaces.
- Password hashing uses `hash_crypto` (SHA-256) before sending.

### Environment Variables
- Use `VITE_` prefix for client-side env vars.
- Development API base: `http://localhost:4234` (`.env.development`).
- Access via `import.meta.env.VITE_API_BASE_URL`.

### Formatting
- No Prettier configured — follow ESLint rules.
- Mixed quote usage exists in codebase; prefer double quotes for consistency with newer files.
- 2-space indentation.

## Key Patterns

- **Routing:** React Router v7 with nested routes under `<Layout />`. Catch-all route (`*`) redirects to `<Main />`.
- **Auth:** Token stored in `localStorage`. `AuthGuard` component controls access.
- **Forms:** React Hook Form + Zod for validation.
- **State:** Redux is installed but not actively used yet (`features/` is empty).
