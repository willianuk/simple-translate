import type { SelectionInfo } from "./../types"

export function getSelectionInfo(): SelectionInfo {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        return { text: "" }
    }

    const range = selection.getRangeAt(0)
    const text = range.toString().trim()
    return text.length > 0 ? { text } : { text: "" }
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
