# Simple Translate

A simple, open-source browser extension for translating selected text on any webpage. Powered by the Reverso translation API.

Available for Chrome and Firefox.

The goal is to provide a lightweight translator without unnecessary options — just select, click, and read.

![Extension Icon](assets/icon.png)

## Features

-   **Instant translation** — select text on any page, click the floating icon, and get a translation card
-   **Multi-language support** — English, Spanish, French, German, Italian, Portuguese
-   **Theme toggle** — light and dark mode
-   **Persistent settings** — language preferences saved automatically
-   **Clean UI** — minimal, readable design with subtle animations

## Installation

### From source

```bash
# Clone the repository
git clone https://github.com/willianuk/simple-translate.git
cd simple-translate

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Then load the extension from `build/chrome-mv3-dev` in your browser's extension manager.

### Production build

```bash
pnpm build
pnpm package
```

The distributable ZIP will be in the `build/` directory.

## Usage

1. Select any text on a webpage
2. Click the translate icon that appears near your selection
3. Read the translation in the popup card

Open the extension popup to change source/target language or toggle the theme.

## Supported Languages

| Code  | Language   |
| ----- | ---------- |
| `eng` | English    |
| `spa` | Spanish    |
| `fra` | French     |
| `ger` | German     |
| `ita` | Italian    |
| `por` | Portuguese |

## Tech Stack

-   [Plasmo](https://docs.plasmo.com/) — Browser extension framework
-   [React 18](https://react.dev/) — UI library
-   [TypeScript](https://www.typescriptlang.org/) — Type safety
-   Reverso API — Translation service

## Project Structure

```
src/
├── background/          # Service worker
├── contents/            # Content scripts (widget, hooks, components)
├── services/            # API clients (reverso.ts)
├── components/          # Shared React components
├── types/               # TypeScript interfaces
└── popup.tsx            # Extension popup UI
```

## Development

```bash
pnpm dev          # Start dev server with hot reload
pnpm build        # Production build
pnpm package      # Create distributable ZIP
pnpm lint         # Lint code
pnpm prettier --write .  # Format code
```

## License

MIT
