import type { SelectionInfo, TextSegment } from "./../types"

export function getSelectionInfo(): SelectionInfo {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        return { text: "" }
    }

    const range = selection.getRangeAt(0)
    const text = range.toString().trim()
    return text.length > 0 ? { text } : { text: "" }
}

export function getSelectionSegments(): TextSegment[] {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return []

    const segments: TextSegment[] = []
    let index = 0

    for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i)
        const fragment = range.cloneContents()

        const walker = document.createTreeWalker(
            fragment,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null
        )

        let currentNode: Node | null
        let currentText = ""
        let currentType: "button" | "heading" | "paragraph" | "text" = "text"

        while ((currentNode = walker.nextNode())) {
            if (currentNode.nodeType === Node.TEXT_NODE) {
                currentText += currentNode.textContent || ""
            } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                const el = currentNode as HTMLElement
                const tag = el.tagName.toLowerCase()

                if (
                    currentText.trim() &&
                    (tag === "button" ||
                        tag === "a" ||
                        el.getAttribute("role") === "button")
                ) {
                    segments.push({
                        text: currentText.trim(),
                        type: "button",
                        index: index++
                    })
                    currentText = ""
                    currentType = "button"
                } else if (currentText.trim() && /^h[1-6]$/.test(tag)) {
                    segments.push({
                        text: currentText.trim(),
                        type: "heading",
                        index: index++
                    })
                    currentText = ""
                    currentType = "heading"
                } else if (
                    currentText.trim() &&
                    (tag === "p" || tag === "div" || tag === "li")
                ) {
                    segments.push({
                        text: currentText.trim(),
                        type: "paragraph",
                        index: index++
                    })
                    currentText = ""
                    currentType = "paragraph"
                }
            }
        }

        if (currentText.trim()) {
            segments.push({
                text: currentText.trim(),
                type: currentType,
                index: index++
            })
        }
    }

    return segments
}

export function parseTextSegments(text: string): TextSegment[] {
    const segments: TextSegment[] = []

    const lines = text.split(/\n/)

    lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        if (trimmedLine) {
            segments.push({
                text: trimmedLine,
                type: "line",
                index
            })
        } else if (index > 0 && lines[index - 1]?.trim()) {
            segments.push({
                text: "",
                type: "paragraph-break",
                index
            })
        }
    })

    if (segments.length === 0 && text.trim()) {
        segments.push({
            text: text.trim(),
            type: "line",
            index: 0
        })
    }

    return segments
}

export function hasMultipleContexts(text: string): boolean {
    const lines = text.split(/\n/).filter((line) => line.trim())
    if (lines.length > 1) return true

    const hasButtons =
        /learn react|api reference|get started|documentation/i.test(text)
    const hasTitles =
        /the library for|create user interfaces|building blocks/i.test(text)

    return hasButtons && hasTitles
}

export function getSelectionRange(): Range | null {
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) {
        return null
    }

    const range = selection.getRangeAt(0)
    return range.collapsed ? null : range
}

export function isOffline(): boolean {
    return !navigator.onLine
}

export function truncateText(text: string, maxLength: number): string {
    return text.length <= maxLength
        ? text
        : text.slice(0, maxLength).trim() + "..."
}
