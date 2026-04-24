// @ts-check

import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
    {
        ignores: [
            ".plasmo/",
            "build/",
            "dist/",
            "out/",
            "node_modules/",
            "coverage/",
            "src/__tests__/setup.ts",
            "*.config.*",
            "*.mjs",
            "*.cjs",
            "**/*.d.ts",
            "vite-env.d.ts",
            "assets/",
        ]
    },
    eslint.configs.recommended,
    tseslint.configs.recommended
)
