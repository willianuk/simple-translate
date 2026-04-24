import { describe, it, expect, vi, beforeEach } from "vitest"
import { translate, ReversoTranslationError, ReversoNetworkError, ReversoEmptyResponseError } from "../services/reverso"

describe("Reverso API", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return translated text on successful response", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ translation: ["hola mundo"] })
        } as Response
        global.fetch = vi.fn().mockResolvedValue(mockResponse)

        const result = await translate("hello world", "eng", "spa")
        expect(result).toBe("hola mundo")
    })

    it("should join multiple translations with space", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ translation: ["hello", "world"] })
        } as Response
        global.fetch = vi.fn().mockResolvedValue(mockResponse)

        const result = await translate("hello world", "eng", "spa")
        expect(result).toBe("hello world")
    })

    it("should throw ReversoTranslationError on non-ok response", async () => {
        const mockResponse = {
            ok: false,
            status: 400,
            statusText: "Bad Request"
        } as Response
        global.fetch = vi.fn().mockResolvedValue(mockResponse)

        await expect(translate("test", "eng", "spa"))
            .rejects.toThrow(ReversoTranslationError)
    })

    it("should throw ReversoEmptyResponseError on empty translation array", async () => {
        const mockResponse = {
            ok: true,
            json: () => Promise.resolve({ translation: [] })
        } as Response
        global.fetch = vi.fn().mockResolvedValue(mockResponse)

        await expect(translate("test", "eng", "spa"))
            .rejects.toThrow(ReversoEmptyResponseError)
    })

    it("should throw ReversoNetworkError on network failure", async () => {
        const originalError = new Error("Network error")
        global.fetch = vi.fn().mockRejectedValue(originalError)

        await expect(translate("test", "eng", "spa"))
            .rejects.toThrow(ReversoNetworkError)
    })

    it("should throw ReversoNetworkError on non-Error thrown values", async () => {
        global.fetch = vi.fn().mockRejectedValue("string error")

        await expect(translate("test", "eng", "spa"))
            .rejects.toThrow(ReversoNetworkError)
    })
})
