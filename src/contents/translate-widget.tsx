import styleText from "data-text:./translate-widget.module.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { TextSegment, TranslateRequest, TranslateResponse } from "../types"
import { MAX_TEXT_LENGTH } from "../utils/constants"
import {
    getSelectionInfo,
    getSelectionRange,
    getSelectionSegments,
    isOffline,
    truncateText
} from "../utils/dom"
import styles from "./translate-widget.module.css"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true
}

export const getShadowHostId = () => "st-translate-host"

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = `
        @import url("https://cdn.jsdelivr.net/npm/meslo-font@1.0.1/meslo-lg.css");
        ${styleText}
    `
    return style
}

interface TranslateWidgetProps {
    onClose?: () => void
}

export default function TranslateWidget({ onClose }: TranslateWidgetProps) {
    const [isIconVisible, setIsIconVisible] = useState(false)
    const [isCardVisible, setIsCardVisible] = useState(false)
    const [selectedText, setSelectedText] = useState("")
    const [selectionRange, setSelectionRange] = useState<Range | null>(null)
    const [translatedText, setTranslatedText] = useState("")
    const [textSegments, setTextSegments] = useState<TextSegment[]>([])
    const [translatedSegments, setTranslatedSegments] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const storage = new Storage()

        const loadTheme = async () => {
            const savedTheme = await storage.get("theme")
            setTheme((savedTheme as "light" | "dark") ?? "light")
        }

        loadTheme()

        storage.watch({
            theme: (change) => {
                const newTheme =
                    (change.newValue as "light" | "dark") ?? "light"
                setTheme(newTheme)
            }
        })

        return () => {
            storage.unwatch({
                theme: () => {}
            })
        }
    }, [])

    const hideAll = useCallback(() => {
        setIsIconVisible(false)
        setIsCardVisible(false)
        onClose?.()
    }, [onClose])

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
    }, [selectedText, selectionRange])

    const handleClose = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation()
            hideAll()
        },
        [hideAll]
    )

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = getSelectionInfo()
            const range = getSelectionRange()

            if (selection.text && range) {
                setSelectedText(selection.text)
                setSelectionRange(range)
                setIsIconVisible(true)
            } else {
                setIsIconVisible(false)
                setIsCardVisible(false)
            }
        }

        document.addEventListener("selectionchange", handleSelectionChange)
        return () => {
            document.removeEventListener(
                "selectionchange",
                handleSelectionChange
            )
        }
    }, [])

    useEffect(() => {
        if (!isIconVisible) return

        let rafId: number | null = null
        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                // Force re-render to recalculate getBoundingClientRect()
                setSelectionRange((prev) => (prev ? prev.cloneRange() : null))
            })
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [isIconVisible])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.shiftKey && isIconVisible && selectedText && !isCardVisible) {
                handleTranslate()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isIconVisible, selectedText, isCardVisible, handleTranslate])

    useEffect(() => {
        if (!isCardVisible) return

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            const shadowHost = document.getElementById(getShadowHostId())
            const shadowRoot = shadowHost?.shadowRoot

            if (!shadowRoot) return

            const iconElement = shadowRoot.querySelector("[data-icon]")
            const cardElement = shadowRoot.querySelector("[data-card]")

            if (
                iconElement?.contains(target) ||
                cardElement?.contains(target)
            ) {
                return
            }

            hideAll()
        }

        document.addEventListener("click", handleClickOutside, true)
        return () => {
            document.removeEventListener("click", handleClickOutside, true)
        }
    }, [isCardVisible, hideAll])

    const getIconPosition = () => {
        if (!selectionRange) return { left: 0, top: 0 }

        // console.log("SelectionRage: ", selectionRange)

        const rect = selectionRange.getBoundingClientRect()
        return {
            left: rect.right,
            top: rect.bottom
        }
    }

    const getCardPosition = () => {
        if (!selectionRange) return { left: 0, top: 0 }

        const rect = selectionRange.getBoundingClientRect()
        const iconSize = 36
        const gap = 8

        const iconX = rect.right
        const iconY = rect.bottom + iconSize / 2

        const cardWidth = 280
        const cardHeight = 120

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top
        const spaceRight = viewportWidth - rect.right
        const spaceLeft = rect.left

        let left: number
        let top: number

        if (spaceBelow >= cardHeight + gap) {
            left = iconX - cardWidth / 2
            top = iconY + iconSize / 2 + gap
        } else if (spaceAbove >= cardHeight + gap) {
            left = iconX - cardWidth / 2
            top = iconY - iconSize / 2 - cardHeight - gap
        } else if (spaceLeft >= cardWidth + gap) {
            left = iconX - cardWidth - gap
            top = iconY - cardHeight / 2
        } else if (spaceRight >= cardWidth + gap) {
            left = iconX + gap
            top = iconY - cardHeight / 2
        } else {
            left = Math.max(
                8,
                Math.min(iconX - cardWidth / 2, viewportWidth - cardWidth - 8)
            )
            top = Math.max(8, rect.bottom + iconSize + gap)
        }

        left = Math.max(8, Math.min(left, viewportWidth - cardWidth - 8))
        top = Math.max(8, Math.min(top, viewportHeight - cardHeight - 8))

        return { left, top }
    }

    const iconPos = getIconPosition()
    const cardPos = getCardPosition()

    return (
        <>
            <div
                data-icon
                data-theme={theme}
                className={styles.icon}
                style={{
                    left: `${iconPos.left}px`,
                    top: `${iconPos.top}px`,
                    opacity: isIconVisible && !isCardVisible ? 1 : 0,
                    pointerEvents:
                        isIconVisible && !isCardVisible ? "auto" : "none"
                }}
                onClick={handleTranslate}>
                🌐
            </div>

            <div
                data-card
                data-theme={theme}
                className={styles.card}
                style={{
                    left: `${cardPos.left}px`,
                    top: `${cardPos.top}px`,
                    opacity: isCardVisible ? 1 : 0,
                    display: isCardVisible ? "block" : "none",
                    pointerEvents: isCardVisible ? "auto" : "none"
                }}>
                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <div className={styles.loadingText}>Translating...</div>
                    </div>
                ) : (
                    <>
                        {translatedSegments.length > 0 ? (
                            <div className={styles.segmentsContainer}>
                                {translatedSegments.map((segment, index) => {
                                    const originalSegment = textSegments[index]
                                    const segmentType = originalSegment?.type

                                    return (
                                        <div
                                            key={index}
                                            className={`${styles.segment} ${styles[segmentType] || ""}`}>
                                            <div className={styles.segmentText}>
                                                {segment}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div
                                className={`${styles.translatedText} ${error ? styles.error : ""}`}>
                                {translatedText || "Error de traducción"}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
