import { BackgroundError, ErrorCode } from "~/background/shared/errors"
import { LANGUAGES } from "~/utils/constants"

export function validateText(text: unknown): string {
    if (typeof text !== "string" || !text) {
        throw new BackgroundError({
            code: ErrorCode.EMPTY_TEXT,
            userMessage: "El texto no puede estar vacío",
            technicalMessage: "Text is not a valid string",
            recoverable: false,
            retryable: false
        })
    }

    return text
}

export function normalizeText(text: string): string {
    return text.trim()
}

export function validateTextLength(text: string, maxLength: number): void {
    if (text.length === 0) {
        throw new BackgroundError({
            code: ErrorCode.EMPTY_TEXT,
            userMessage: "El texto no puede estar vacío",
            technicalMessage: "Text is empty after trimming",
            recoverable: false,
            retryable: false
        })
    }

    if (text.length > maxLength) {
        throw new BackgroundError({
            code: ErrorCode.TEXT_TOO_LONG,
            userMessage: `El texto excede el límite de ${maxLength} caracteres`,
            technicalMessage: `Text length ${text.length} exceeds max ${maxLength}`,
            recoverable: false,
            retryable: false,
            metadata: { length: text.length, maxLength }
        })
    }
}

export function isValidLanguage(lang: string): boolean {
    return LANGUAGES.some((l) => l.code === lang)
}
