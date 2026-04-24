# Repository Guidelines

## Project Structure & Module Organization

```
├── src/
│   ├── background/       # Service worker & message handlers
│   │   ├── index.ts
│   │   └── messages/
│   ├── contents/         # Content scripts & translate widget
│   ├── components/       # Shared React components
│   ├── services/         # API services
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Constants & DOM utilities
│   ├── popup.tsx         # Extension popup UI
│   └── popup.css         # Popup styles
├── assets/               # Static assets (icons, images)
├── .plasmo/              # Generated files (do not edit)
└── build/                # Build outputs (not committed)
```

## Build, Test, and Development Commands

- `pnpm dev` — Development with hot reload (load from `build/chrome-mv3-dev`)
- `pnpm build` — Production build (outputs to `build/chrome-mv3`)
- `pnpm package` — Create distributable ZIP
- `pnpm lint` — Run linter
- `pnpm prettier --write .` — Format code

Note: No test framework is configured. Tests are not expected.

## Coding Style & Naming Conventions

**Formatting (Prettier)**: Print width 80, tab width 4, no semicolons, bracket spacing enabled, bracket same line.

**Import order**: Node built-ins → third-party → `@plasmo/*` → `@plasmohq/*` → `~/*` → relative imports. Enforced by `@ianvs/prettier-plugin-sort-imports`.

**TypeScript**: Use explicit types; `interface` for object shapes, `type` for unions/aliases; never use `any`.

**Naming**: Files: camelCase. Components: PascalCase. Functions: camelCase. Interfaces: PascalCase. Constants: SCREAMING_SNAKE_CASE.

**React**: Functional components + hooks only. Use CSS modules or `popup.css` — no inline styles.

**Storage**: Use `@plasmohq/storage` everywhere. In React: `useStorage` hook. In scripts: `Storage` class. Always provide default values.

## Testing Guidelines

No test framework is configured in this repository. If adding tests, use Vitest (see `vitest.config.ts`) and place files alongside source with `.test.ts` extension.

## Commit & Pull Request Guidelines

**Commit messages**: Use conventional commits format. Examples: `feat: add translation widget`, `fix: correct storage null handling`, `docs: update README`.

**Pull requests**: Include clear description of changes, linked issues, and relevant screenshots for UI changes. Ensure CI passes.

## What NOT To Do

- Do NOT add ESLint/Prettier overrides to bypass warnings
- Do NOT commit build artifacts (`build/`, `.plasmo/`)
- Do NOT add test files unless framework is set up
- Do NOT use inline styles
- Do NOT use `any` type
- Do NOT make assumptions about Chrome API availability — always feature detect

## Agent-Specific Instructions

- Use Context7 for library documentation: `context7_resolve-library-id` then `context7_query-docs`
- Follow import ordering rules strictly
- Always wrap async operations in try/catch with error logging