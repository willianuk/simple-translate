import { useCallback, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type {
    TextSegment,
    TranslateRequest,
    TranslateResponse
} from "../../types"
import { MAX_TEXT_LENGTH } from "../../utils/constants"
import { getSelectionSegments, isOffline, truncateText } from "../../utils/dom"

interface UseTranslationProps {
    selectedText: string
    selectionRange: Range | null
    setIsCardVisible: (visible: boolean) => void
}

export function useTranslation({
    selectedText,
    selectionRange,
    setIsCardVisible
}: UseTranslationProps) {
    const [translatedText, setTranslatedText] = useState("")
    const [textSegments, setTextSegments] = useState<TextSegment[]>([])
    const [translatedSegments, setTranslatedSegments] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTranslate = useCallback(async () => {
        if (!selectedText || !selectionRange) return

        setIsCardVisible(true)

        if (isOffline()) {
            setTranslatedText("Sin conexión")
            setTranslatedSegments([])
            setError(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)
        setTranslatedText("Translating...")
        setTranslatedSegments([])

        try {
            const segments = getSelectionSegments()
            const DELIMITER = "§"

            if (segments.length > 1) {
                const validSegments = segments.filter((s) => s.text.trim())
                const combinedText = validSegments
                    .map((s) => s.text)
                    .join(` ${DELIMITER} `)

                const response = await sendToBackground<
                    TranslateRequest,
                    TranslateResponse
                >({
                    name: "translate",
                    body: { text: combinedText }
                })

                // console.log("response: ", response)

                if (response.error) {
                    setError(response.error)
                    setTranslatedText("Error de traducción")
                    setTextSegments([])
                    setTranslatedSegments([])
                } else {
                    const translatedParts = (response.translatedText || "")
                        .split(DELIMITER)
                        .map((part) => part.trim())

                    setTextSegments(validSegments)
                    setTranslatedSegments(translatedParts)
                    setTranslatedText("")
                }
            } else {
                const textToTranslate = truncateText(
                    selectedText,
                    MAX_TEXT_LENGTH
                )

                const response = await sendToBackground<
                    TranslateRequest,
                    TranslateResponse
                >({
                    name: "translate",
                    body: { text: textToTranslate }
                })

                if (response.error) {
                    setError(response.error)
                    setTranslatedText("Error de traducción")
                } else {
                    setTranslatedText(response.translatedText || "")
                }

                setTextSegments([])
                setTranslatedSegments([])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
            setTranslatedText("Error de traducción")
            setTranslatedSegments([])
        } finally {
            setIsLoading(false)
        }
    }, [selectedText, selectionRange, setIsCardVisible])

    return {
        translatedText,
        textSegments,
        translatedSegments,
        isLoading,
        error,
        handleTranslate
    }
}
