export interface PositionRect {
  x: number
  y: number
  width: number
  height: number
}

export interface SelectionInfo {
  text: string
  position: PositionRect | null
  containerElement: HTMLElement | null
}

export interface TranslationRequest {
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

export interface TranslationResponse {
  translation: string[]
}

export interface TranslateRequest {
  text: string
  fromLang: string
  toLang: string
}

export interface TranslateResponse {
  translatedText?: string
  error?: string
}
