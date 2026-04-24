import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/__tests__/setup.ts"],
        css: false,
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "src/__tests__/",
                "**/*.d.ts",
                "**/*.config.*",
                "**/utils/constants.ts"
            ]
        }
    },
    resolve: {
        alias: {
            "~": resolve(__dirname, "src")
        }
    }
})
