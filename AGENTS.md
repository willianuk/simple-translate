# AGENTS.md — Simple Translate Extension

Guidance for agentic coding agents operating in this repository.

## Project Overview

-   **Project**: Simple Translate — Browser extension (Chrome Manifest V3)
-   **Framework**: [Plasmo](https://docs.plasmo.com/) + React 18
-   **Language**: TypeScript
-   **Package Manager**: pnpm

## Build Commands

```bash
pnpm dev        # Development (hot reload)
pnpm build      # Production build
pnpm package    # Package for distribution
pnpm lint       # Lint code
pnpm prettier --write .  # Format code
```

**Note**: No test framework is configured. Tests are not expected.

## Code Style Guidelines

### Formatting (Prettier)

Configuration in `.prettierrc.mjs`:

| Option            | Value |
| ----------------- | ----- |
| Print width       | 80    |
| Tab width         | 4     |
| Use tabs          | No    |
| Semicolons        | No    |
| Single quotes     | No    |
| Trailing commas   | None  |
| Bracket spacing   | Yes   |
| Bracket same line | Yes   |

### Import Order

Imports must follow this order (enforced by `@ianvs/prettier-plugin-sort-imports`):

1. Node.js built-in modules (`<BUILTIN_MODULES>`)
2. Third-party modules (`<THIRD_PARTY_MODULES>`)
3. `@plasmo/*` (Plasmo framework)
4. `@plasmohq/*` (Plasmo utilities)
5. `~/*` (project alias → root directory)
6. Relative imports (`./`, `../`)

### TypeScript

-   Path alias: `~/*` maps to `src/` directory (defined in `tsconfig.json`)
-   Use explicit types for interfaces and function parameters
-   Use `interface` for object shapes, `type` for unions/aliases
-   **Never use `any`** — use proper TypeScript types

### Naming Conventions

-   **Files**: camelCase for JS/TS files, PascalCase for React components
-   **Components**: PascalCase (e.g., `IndexPopup`)
-   **Functions**: camelCase
-   **Interfaces**: PascalCase with optional `I` prefix (use descriptive names like `StorageData`)
-   **Constants**: SCREAMING_SNAKE_CASE for enums/static configs (e.g., `LANGUAGES`)

### React Patterns

-   Use functional components with hooks
-   Prefer `useState` + `useEffect` for side effects
-   Handle async operations with `.then()` or `async/await`
-   Use TypeScript interfaces for component props and state
-   **Do NOT use inline styles** — use CSS modules or popup.css

### Error Handling

-   Always wrap async operations in `try/catch`
-   Log errors with context: `console.error("Module: Error", error)`
-   Use custom error classes for different error types
-   Display user-friendly error messages in UI
-   Respond with error field in message responses: `{ error: "User-friendly message" }`

### Storage (`@plasmohq/storage`)

Use `@plasmohq/storage` instead of raw `chrome.storage` APIs.

-   **React components** (popup): `useStorage` hook from `@plasmohq/storage/hook`
-   **Content scripts / Background**: `Storage` class from `@plasmohq/storage`
-   Always handle missing keys with default values: `(v) => v ?? defaultValue`

## Project Structure

```
├── src/
│   ├── background/       # Background service worker
│   │   ├── index.ts      # Entry point
│   │   └── messages/     # Message handlers (e.g., translate.ts)
│   ├── components/       # Shared React components
│   ├── contents/         # Content scripts
│   │   ├── components/   # Content script React components
│   │   ├── hooks/        # Custom hooks (useTranslation, useSelection, etc.)
│   │   ├── utils/        # Position calculation utilities
│   │   └── translate-widget.tsx
│   ├── icons/            # SVG icon components
│   ├── services/         # API services (reverso.ts, storage.ts)
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Constants and DOM utilities
│   ├── popup.tsx         # Extension popup UI
│   └── popup.css         # Popup styles
├── assets/               # Static assets (icons, images)
└── .plasmo/              # Plasmo generated files (do not edit)
```

## Development Workflow

1. **Development mode**: `pnpm dev` → load from `build/chrome-mv3-dev`
2. **Production build**: `pnpm build` → output in `build/chrome-mv3`
3. **Package**: `pnpm package` → creates distributable ZIP
4. **Code quality**: `pnpm lint` and `pnpm prettier --write .`

## Common Tasks

### Adding a new API service

1. Create file in `src/services/<name>.ts`
2. Export custom error class extending `Error`
3. Export async function (e.g., `translate()`) returning result string
4. Use proper error handling with try/catch
5. Log errors with contextual messages

### Adding UI to popup

Edit `popup.tsx` — it's a React component. Styles go in `popup.css`.

### Adding content script widget

Create/modify `src/contents/translate-widget.tsx`. Use CSS modules (`.module.css`).

### Working with messaging

-   Use `@plasmohq/messaging` for popup ↔ background communication
-   Define request/response types in `src/types/index.ts`
-   Handle validation and return `{ error: string }` for failures

### Working with storage

-   Use `@plasmohq/storage` for all storage operations
-   In React components: `useStorage(key, validator)`
-   In content/background scripts: `new Storage()` with async `get()`/`set()`
-   Always provide default values with `(v) => v ?? defaultValue`

## What NOT To Do

-   Do NOT add ESLint/Prettier overrides to bypass warnings
-   Do NOT use `any` type — use proper TypeScript types
-   Do NOT commit build artifacts (`build/`, `.plasmo/`)
-   Do NOT add test files — no test framework exists
-   Do NOT use inline styles in React components
-   Do NOT make assumptions about Chrome API availability — check for feature detection

## Documentation & Library Research

**Always use Context7** when the task involves:

-   Library or API documentation lookup
-   Code generation using external libraries
-   Setup or configuration steps for dependencies
-   Understanding framework-specific patterns

Use `context7_resolve-library-id` and `context7_query-docs` proactively.
