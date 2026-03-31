import type { ReversoRequestBody, ReversoResponse } from "../types"
import { API_ENDPOINT } from "../utils/constants"

export class ReversoTranslationError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly statusText?: string
    ) {
        super(message)
        this.name = "ReversoTranslationError"
    }
}

export class ReversoNetworkError extends Error {
    constructor(
        message: string,
        public readonly originalError?: Error
    ) {
        super(message)
        this.name = "ReversoNetworkError"
    }
}

export class ReversoEmptyResponseError extends Error {
    constructor() {
        super("Reverso API returned empty translation")
        this.name = "ReversoEmptyResponseError"
    }
}

export async function translate(
    text: string,
    from: string,
    to: string
): Promise<string> {
    try {
        console.log("Text translate: ", text)

        const requestBody: ReversoRequestBody = {
            input: text,
            from,
            to,
            options: {
                contextResults: true,
                languageDetection: true,
                origin: "translation.web",
                sentenceSplitter: true
            },
            format: "text"
        }

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
            throw new ReversoTranslationError(
                `Reverso API error: ${response.status} ${response.statusText}`,
                response.status,
                response.statusText
            )
        }

        const data: ReversoResponse = await response.json()

        if (!data.translation || data.translation.length === 0) {
            throw new ReversoEmptyResponseError()
        }

        // return data.translation[0]
        return data.translation.join(" ")
    } catch (error) {
        if (error instanceof ReversoTranslationError) {
            throw error
        }
        if (error instanceof ReversoEmptyResponseError) {
            throw error
        }
        if (error instanceof Error) {
            throw new ReversoNetworkError(
                `Failed to connect to Reverso API: ${error.message}`,
                error
            )
        }
        throw new ReversoNetworkError(
            "Unknown error occurred during translation"
        )
    }
}
