import { describe, it, expect } from "vitest"
import { MAX_TEXT_LENGTH, API_ENDPOINT, DEFAULT_FROM_LANG, DEFAULT_TO_LANG, LANGUAGES } from "../utils/constants"

describe("Constants", () => {
    describe("MAX_TEXT_LENGTH", () => {
        it("should be a positive number", () => {
            expect(MAX_TEXT_LENGTH).toBeGreaterThan(0)
        })

        it("should be 500 characters", () => {
            expect(MAX_TEXT_LENGTH).toBe(500)
        })
    })

    describe("API_ENDPOINT", () => {
        it("should be a valid URL string", () => {
            expect(API_ENDPOINT).toMatch(/^https:\/\//)
        })

        it("should point to Reverso API", () => {
            expect(API_ENDPOINT).toContain("reverso.net")
        })
    })

    describe("DEFAULT_LANGUAGES", () => {
        it("should have default from language set to English", () => {
            expect(DEFAULT_FROM_LANG).toBe("eng")
        })

        it("should have default to language set to Spanish", () => {
            expect(DEFAULT_TO_LANG).toBe("spa")
        })
    })

    describe("LANGUAGES", () => {
        it("should contain 6 languages", () => {
            expect(LANGUAGES).toHaveLength(6)
        })

        it("should include Spanish", () => {
            expect(LANGUAGES).toContainEqual({ code: "spa", name: "Spanish" })
        })

        it("should include English", () => {
            expect(LANGUAGES).toContainEqual({ code: "eng", name: "English" })
        })

        it("should include French", () => {
            expect(LANGUAGES).toContainEqual({ code: "fra", name: "French" })
        })

        it("should include German", () => {
            expect(LANGUAGES).toContainEqual({ code: "ger", name: "German" })
        })

        it("should include Italian", () => {
            expect(LANGUAGES).toContainEqual({ code: "ita", name: "Italian" })
        })

        it("should include Portuguese", () => {
            expect(LANGUAGES).toContainEqual({ code: "por", name: "Portuguese" })
        })

        it("should have unique language codes", () => {
            const codes = LANGUAGES.map(l => l.code)
            const uniqueCodes = new Set(codes)
            expect(uniqueCodes.size).toBe(codes.length)
        })
    })
})
