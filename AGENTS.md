# AGENTS.md — Simple Translate Extension

This file provides guidance for agentic coding agents operating in this repository.

## Project Overview

- **Project**: Simple Translate — Browser extension (Chrome Manifest V3)
- **Framework**: [Plasmo](https://docs.plasmo.com/) + React 18
- **Language**: TypeScript
- **Package Manager**: pnpm

## Build Commands

```bash
# Development (hot reload)
pnpm dev

# Production build
pnpm build

# Package for distribution
pnpm package
```

**Note**: No test framework is configured. Tests are not expected.

## Code Style Guidelines

### Formatting (Prettier)

Configuration in `.prettierrc.mjs`:

| Option            | Value |
| ----------------- | ----- |
| Print width       | 80    |
| Tab width         | 2     |
| Use tabs          | No    |
| Semicolons        | No    |
| Single quotes     | No    |
| Trailing commas   | None  |
| Bracket spacing   | Yes   |
| Bracket same line | Yes   |

**Run formatter before committing:**

```bash
pnpm prettier --write .
```

### Import Order

Imports must follow this order (enforced by `@ianvs/prettier-plugin-sort-imports`):

1. Node.js built-in modules (`<BUILTIN_MODULES>`)
2. Third-party modules (`<THIRD_PARTY_MODULES>`)
3. `@plasmo/*` (Plasmo framework)
4. `@plasmohq/*` (Plasmo utilities)
5. `~/*` (project alias → root directory)
6. Relative imports (`./`, `../`)

### TypeScript

- Path alias: `~/*` maps to project root
- Use explicit types for interfaces and function parameters
- Use `interface` for object shapes, `type` for unions/aliases

### Naming Conventions

- **Files**: camelCase for JS/TS files, PascalCase for React components
- **Components**: PascalCase (e.g., `IndexPopup`)
- **Functions**: camelCase
- **Interfaces**: PascalCase with `I` prefix optional (use descriptive names like `StorageData`)
- **Constants**: SCREAMING_SNAKE_CASE for enums/static configs (e.g., `LANGUAGES`)

### React Patterns

- Use functional components with hooks
- Prefer `useState` + `useEffect` for side effects
- Handle async operations with `.then()` or `async/await`
- Use TypeScript interfaces for component props and state

### Error Handling

- Always wrap async operations in `try/catch`
- Log errors to console with context: `console.error("Module: Error", error)`
- Display user-friendly error messages in UI

### Storage (`@plasmohq/storage`)

Use `@plasmohq/storage` instead of raw `chrome.storage` APIs.

- **React components** (popup): `useStorage` hook from `@plasmohq/storage/hook`
- **Content scripts**: `Storage` class from `@plasmohq/storage`

```tsx
// popup.tsx
import { useStorage } from "@plasmohq/storage/hook"

const [fromLang, setFromLang] = useStorage("fromLang", (v) => v ?? "spa")
```

```ts
// content.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()
const fromLang = (await storage.get("fromLang")) ?? "spa"
```

## Project Structure

```
├── src-api/api/       # API modules (e.g., reverso.ts)
├── popup.tsx          # Extension popup UI
├── popup.css          # Popup styles
├── content.ts         # Content script (injected into pages)
├── assets/            # Static assets (icons, images)
└── .plasmo/           # Plasmo generated files
```

## Documentation & Library Research

**Always use Context7** when the task involves:

- Library or API documentation lookup
- Code generation using external libraries
- Setup or configuration steps for dependencies
- Understanding framework-specific patterns

Use the tools `context7_resolve-library-id` and `context7_query-docs` **proactively** — do not wait for the user to explicitly request it. If a task touches an external library, fire Context7 before writing code.

## Development Workflow

### Running the Extension

1. **Development mode** (hot reload):

   ```bash
   pnpm dev
   ```

   Then load the extension in Chrome from `build/chrome-mv3-dev`

2. **Production build**:

   ```bash
   pnpm build
   ```

   Output in `build/chrome-mv3` directory

3. **Package for distribution**:
   ```bash
   pnpm package
   ```

### Code Quality

- **Format code** before committing:

  ```bash
  pnpm prettier --write .
  ```

- **Type checking** is built into the build process via TypeScript

- **No test framework** — tests are not expected

## Common Tasks

### Adding a new API endpoint

1. Create file in `src-api/api/<name>.ts`
2. Export typed request/response interfaces
3. Export async function that returns translation string
4. Use proper error handling with try/catch
5. Log errors with contextual messages

### Adding UI to popup

Edit `popup.tsx` — it's a React component. Styles go in `popup.css`.

### Modifying content script

Edit `content.ts` — handles text selection and floating icon. Uses vanilla JS DOM manipulation.

### Working with storage

- Use `@plasmohq/storage` for all storage operations
- In React components, use the `useStorage` hook for reactive state
- In content scripts, use the `Storage` class for async access
- Always handle missing keys with default values: `(v) => v ?? defaultValue`

## What NOT To Do

- Do NOT add ESLint/Prettier overrides to bypass warnings
- Do NOT use `any` type — use proper TypeScript types
- Do NOT commit build artifacts (`build/`, `.plasmo/`)
- Do NOT add test files — no test framework exists
- Do NOT use inline styles in React components — use popup.css
- Do NOT make assumptions about Chrome API availability — check for feature detection
