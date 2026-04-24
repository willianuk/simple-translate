import { describe, it, expect, vi, beforeEach } from "vitest"
import {
    getSelectionInfo,
    getSelectionRange,
    truncateText,
    isOffline
} from "../utils/dom"

describe("getSelectionInfo", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return empty text when no selection", () => {
        const mockGetSelection = vi.fn(() => null)
        Object.defineProperty(window, "getSelection", { value: mockGetSelection })

        const result = getSelectionInfo()
        expect(result).toEqual({ text: "" })
    })

    it("should return empty text when selection is collapsed", () => {
        const mockSelection = {
            isCollapsed: true,
            rangeCount: 1,
            getRangeAt: () => ({ toString: () => "text" })
        }
        Object.defineProperty(window, "getSelection", { value: () => mockSelection })

        const result = getSelectionInfo()
        expect(result).toEqual({ text: "" })
    })

    it("should return trimmed text from selection", () => {
        const mockSelection = {
            isCollapsed: false,
            rangeCount: 1,
            getRangeAt: () => ({
                toString: () => "  selected text  ",
                cloneContents: () => document.createDocumentFragment()
            })
        }
        Object.defineProperty(window, "getSelection", { value: () => mockSelection })

        const result = getSelectionInfo()
        expect(result).toEqual({ text: "selected text" })
    })
})

describe("getSelectionRange", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return null when no selection", () => {
        Object.defineProperty(window, "getSelection", { value: () => null })

        const result = getSelectionRange()
        expect(result).toBeNull()
    })

    it("should return null when range is collapsed", () => {
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: () => ({ collapsed: true })
        }
        Object.defineProperty(window, "getSelection", { value: () => mockSelection })

        const result = getSelectionRange()
        expect(result).toBeNull()
    })

    it("should return range when valid", () => {
        const mockRange = { collapsed: false, cloneRange: () => ({}) }
        const mockSelection = {
            rangeCount: 1,
            getRangeAt: () => mockRange
        }
        Object.defineProperty(window, "getSelection", { value: () => mockSelection })

        const result = getSelectionRange()
        expect(result).toBe(mockRange)
    })
})

describe("truncateText", () => {
    it("should return original text if shorter than max", () => {
        expect(truncateText("hello", 10)).toBe("hello")
    })

    it("should truncate and add ellipsis if longer than max", () => {
        expect(truncateText("hello world foo bar", 10)).toBe("hello worl...")
    })

    it("should handle exact length", () => {
        expect(truncateText("12345", 5)).toBe("12345")
    })
})

describe("isOffline", () => {
    it("should return false when navigator.onLine is true", () => {
        Object.defineProperty(navigator, "onLine", { value: true, writable: true })
        expect(isOffline()).toBe(false)
    })

    it("should return true when navigator.onLine is false", () => {
        Object.defineProperty(navigator, "onLine", { value: false, writable: true })
        expect(isOffline()).toBe(true)
    })
})
