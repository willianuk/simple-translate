# AGENTS.md — Simple Translate Extension

This file provides guidance for agentic coding agents operating in this repository.

## Project Overview

-   **Project**: Simple Translate — Browser extension (Chrome Manifest V3)
-   **Framework**: [Plasmo](https://docs.plasmo.com/) + React 18
-   **Language**: TypeScript
-   **Package Manager**: pnpm

## Build Commands

```bash
# Development (hot reload)
pnpm dev

# Production build
pnpm build

# Package for distribution
pnpm package

# Lint code
pnpm lint

# Format code
pnpm prettier --write .
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

### ESLint

Configuration in `eslint.config.mjs` uses TypeScript ESLint with recommended rules.

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
-   Respond with error field in message responses:

```typescript
response.send({ error: "User-friendly message" })
```

### Storage (`@plasmohq/storage`)

Use `@plasmohq/storage` instead of raw `chrome.storage` APIs.

-   **React components** (popup): `useStorage` hook from `@plasmohq/storage/hook`
-   **Content scripts / Background**: `Storage` class from `@plasmohq/storage`
-   Always handle missing keys with default values: `(v) => v ?? defaultValue`

## Project Structure

```
├── src/
│   ├── api/              # API modules (e.g., reverso.ts)
│   ├── background/
│   │   └── messages/     # Message handlers
│   ├── contents/         # Content scripts (translate-widget.tsx)
│   ├── popup.tsx         # Extension popup UI
│   ├── services/         # Storage and API services
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Constants and DOM utilities
├── assets/               # Static assets (icons, images)
├── popup.css             # Popup styles
└── .plasmo/              # Plasmo generated files
```

## Development Workflow

### Running the Extension

1. **Development mode**: `pnpm dev` → load from `build/chrome-mv3-dev`
2. **Production build**: `pnpm build` → output in `build/chrome-mv3`
3. **Package**: `pnpm package` → creates distributable ZIP

### Code Quality

-   **Format before committing**: `pnpm prettier --write .`
-   **Lint before committing**: `pnpm lint`
-   Type checking is built into the build process via TypeScript
-   **No test framework** — tests are not expected

## Common Tasks

### Adding a new API endpoint

1. Create file in `src/services/<name>.ts`
2. Export custom error class extending `Error`
3. Export async `translate()` function returning translation string
4. Use proper error handling with try/catch
5. Log errors with contextual messages

### Adding UI to popup

Edit `popup.tsx` — it's a React component. Styles go in `popup.css`.

### Adding content script widget

Create `src/contents/<name>.tsx`. Use CSS modules (`.module.css`).

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
