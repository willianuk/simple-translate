import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

// Mock Window.getSelection for DOM tests
Object.defineProperty(window, "getSelection", {
    writable: true,
    value: vi.fn(() => ({
        isCollapsed: false,
        rangeCount: 1,
        getRangeAt: vi.fn(() => ({
            toString: () => "selected text",
            cloneContents: () => document.createDocumentFragment(),
            getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 20 }),
            collapsed: false,
            cloneRange: () => ({})
        }))
    }))
})

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
    }))
})
