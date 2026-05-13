import type { TranslateResponse } from "~/background/types"
import { BackgroundError } from "~/background/shared/errors"

export function formatSuccessResponse(
    translatedText: string
): TranslateResponse {
    return { success: true, translatedText }
}

export function formatErrorResponse(error: BackgroundError): TranslateResponse {
    return {
        success: false,
        error: error.context.userMessage,
        code: error.context.code
    }
}
