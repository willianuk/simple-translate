import { useEffect } from "react"

interface UseKeyboardShortcutProps {
    isIconVisible: boolean
    selectedText: string
    isCardVisible: boolean
    handleTranslate: () => void
}

export function useKeyboardShortcut({
    isIconVisible,
    selectedText,
    isCardVisible,
    handleTranslate
}: UseKeyboardShortcutProps) {
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
}
