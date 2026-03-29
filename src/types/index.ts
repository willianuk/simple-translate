export interface SelectionInfo {
    text: string
}

// Reverso API types
export interface ReversoRequestBody {
    input: string
    from: string
    to: string
    options: {
        contextResults: boolean
        languageDetection: boolean
        origin: string
        sentenceSplitter: boolean
    }
    format: "text"
}

export interface ReversoResponse {
    translation: string[]
}

// Extension messaging types
export interface TranslateRequest {
    text: string
    fromLang?: string
    toLang?: string
}

export interface TranslateResponse {
    translatedText?: string
    error?: string
}
