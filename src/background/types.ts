import type { ErrorCode, ErrorContext } from "./shared/errors"

export type { ErrorCode, ErrorContext }

export type TranslateResponse =
    | { success: true; translatedText: string }
    | { success: false; error: string; code: ErrorCode }
