import { useEffect, useState } from "react"

import { getSelectionInfo, getSelectionRange } from "../../utils/dom"

export function useSelection() {
    const [selectedText, setSelectedText] = useState("")
    const [selectionRange, setSelectionRange] = useState<Range | null>(null)
    const [isIconVisible, setIsIconVisible] = useState(false)

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

    return { selectedText, selectionRange, isIconVisible }
}
