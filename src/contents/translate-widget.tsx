import styleText from "data-text:./translate-widget.module.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { TranslateRequest, TranslateResponse } from "../types"
import { MAX_TEXT_LENGTH } from "../utils/constants"
import {
    getSelectionInfo,
    getSelectionRange,
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
    style.textContent = styleText
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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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
            setError(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)
        setTranslatedText("Translating...")

        try {
            const textToTranslate = truncateText(selectedText, MAX_TEXT_LENGTH)

            console.log("Contents texttotranslate: ", textToTranslate)

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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error")
            setTranslatedText("Error de traducción")
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
                className={styles.card}
                style={{
                    left: `${cardPos.left}px`,
                    top: `${cardPos.top}px`,
                    opacity: isCardVisible ? 1 : 0,
                    display: isCardVisible ? "block" : "none",
                    pointerEvents: isCardVisible ? "auto" : "none"
                }}>
                {/*<button className={styles.closeBtn} onClick={handleClose}>
                    ×
                </button>*/}

                <div
                    className={`${styles.translatedText} ${error ? styles.error : ""}`}>
                    {isLoading
                        ? "Translating..."
                        : translatedText || "Error de traducción"}
                </div>
            </div>
        </>
    )
}
