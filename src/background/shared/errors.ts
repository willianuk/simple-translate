import {
    ReversoEmptyResponseError,
    ReversoNetworkError,
    ReversoTranslationError
} from "~/services/reverso"

export enum ErrorCode {
    EMPTY_TEXT = "EMPTY_TEXT",
    TEXT_TOO_LONG = "TEXT_TOO_LONG",
    TRANSLATION_FAILED = "TRANSLATION_FAILED",
    NETWORK_ERROR = "NETWORK_ERROR",
    INVALID_LANGUAGE = "INVALID_LANGUAGE",
    UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface ErrorContext {
    code: ErrorCode
    userMessage: string
    technicalMessage: string
    recoverable: boolean
    retryable: boolean
    metadata?: Record<string, unknown>
}

export class BackgroundError extends Error {
    constructor(public context: ErrorContext) {
        super(context.userMessage)
        this.name = "BackgroundError"
    }
}

export function mapReversoError(error: unknown): BackgroundError {
    if (error instanceof ReversoTranslationError) {
        return new BackgroundError({
            code: ErrorCode.TRANSLATION_FAILED,
            userMessage: "Error de traducción",
            technicalMessage: error.message,
            recoverable: false,
            retryable: (error.statusCode ?? 0) >= 500,
            metadata: {
                statusCode: error.statusCode,
                statusText: error.statusText
            }
        })
    }

    if (error instanceof ReversoNetworkError) {
        return new BackgroundError({
            code: ErrorCode.NETWORK_ERROR,
            userMessage: "Error de conexión",
            technicalMessage: error.message,
            recoverable: false,
            retryable: true,
            metadata: {
                originalError: error.originalError?.message
            }
        })
    }

    if (error instanceof ReversoEmptyResponseError) {
        return new BackgroundError({
            code: ErrorCode.TRANSLATION_FAILED,
            userMessage: "No se pudo obtener la traducción",
            technicalMessage: error.message,
            recoverable: false,
            retryable: true
        })
    }

    return new BackgroundError({
        code: ErrorCode.UNKNOWN_ERROR,
        userMessage: "Error inesperado",
        technicalMessage:
            error instanceof Error ? error.message : String(error),
        recoverable: false,
        retryable: false
    })
}
