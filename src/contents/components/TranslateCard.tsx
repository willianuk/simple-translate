import type { TextSegment } from "../../types"
import styles from "../translate-widget.module.css"
import SegmentList from "./SegmentList"

export interface TranslateCardProps {
    position: {
        left: number
        top: number
    }
    isVisible: boolean
    theme: "light" | "dark"
    isLoading: boolean
    translatedText: string
    translatedSegments: string[]
    textSegments: TextSegment[]
    error: string | null
}

export default function TranslateCard({
    position,
    isVisible,
    theme,
    isLoading,
    translatedText,
    translatedSegments,
    textSegments,
    error
}: TranslateCardProps) {
    return (
        <div
            data-card
            data-theme={theme}
            className={styles.card}
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
                opacity: isVisible ? 1 : 0,
                display: isVisible ? "block" : "none",
                pointerEvents: isVisible ? "auto" : "none"
            }}>
            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Translating...</div>
                </div>
            ) : (
                <>
                    {translatedSegments.length > 0 ? (
                        <SegmentList
                            segments={translatedSegments}
                            originalSegments={textSegments}
                        />
                    ) : (
                        <div
                            className={`${styles.translatedText} ${error ? styles.error : ""}`}>
                            {translatedText || "Error de traducción"}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
