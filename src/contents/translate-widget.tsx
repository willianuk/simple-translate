import cssText from "data-text:./translate-widget.module.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { useCallback, useState } from "react"

import TranslateCard from "~/contents/components/TranslateCard"
import TranslateIcon from "~/contents/components/TranslateIcon"
import { useClickOutside } from "~/contents/hooks/useClickOutside"
import { useKeyboardShortcut } from "~/contents/hooks/useKeyboardShortcut"
import { useSelection } from "~/contents/hooks/useSelection"
import { useTheme } from "~/contents/hooks/useTheme"
import { useTranslation } from "~/contents/hooks/useTranslation"
import {
    calculateCardPosition,
    calculateIconPosition
} from "~/contents/utils/calculatePosition"

// import * as styles from "./translate-widget.module.css"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true
}

export const getShadowHostId = () => "st-translate-host"

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

interface TranslateWidgetProps {
    onClose?: () => void
}

export default function TranslateWidget({ onClose }: TranslateWidgetProps) {
    const [isCardVisible, setIsCardVisible] = useState(false)

    const { theme } = useTheme()
    const { selectedText, selectionRange, isIconVisible } = useSelection()
    const {
        translatedText,
        textSegments,
        translatedSegments,
        isLoading,
        error,
        handleTranslate
    } = useTranslation({
        selectedText,
        selectionRange,
        setIsCardVisible
    })

    const hideAll = useCallback(() => {
        setIsCardVisible(false)
        onClose?.()
    }, [onClose])

    useClickOutside({
        isCardVisible,
        hideAll,
        getShadowHostId
    })

    useKeyboardShortcut({
        isIconVisible,
        selectedText,
        isCardVisible,
        handleTranslate
    })

    const iconPosition = calculateIconPosition(selectionRange)
    const cardPosition = calculateCardPosition(selectionRange)

    return (
        <>
            <TranslateIcon
                position={iconPosition}
                isVisible={isIconVisible && !isCardVisible}
                theme={theme}
                onClick={handleTranslate}
            />
            <TranslateCard
                position={cardPosition}
                isVisible={isCardVisible}
                theme={theme}
                isLoading={isLoading}
                translatedText={translatedText}
                translatedSegments={translatedSegments}
                textSegments={textSegments}
                error={error}
            />
        </>
    )
}
