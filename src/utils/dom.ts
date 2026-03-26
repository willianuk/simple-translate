import type { PositionRect, SelectionInfo } from "./../types"
import { MAX_TEXT_LENGTH } from "./constants"

// Void elements (self-closing, cannot have children)
const VOID_ELEMENTS = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
])

const FORM_INPUT_ELEMENTS = new Set(["input", "textarea"])

export function getContainerElement(): HTMLElement | null {
    const selection = window.getSelection()

    if (!selection || !selection.anchorNode) {
        return null
    }

    let container: HTMLElement | null = null

    if (selection.anchorNode.nodeType === 3) {
        container = selection.anchorNode.parentElement
    } else if (selection.anchorNode.nodeType === 1) {
        container = selection.anchorNode as HTMLElement
    }

    if (!container) {
        return null
    }

    const tagName = container.tagName.toLowerCase()

    // Validate: not a void element
    if (VOID_ELEMENTS.has(tagName)) {
        return null
    }

    // Validate: not a form input element
    if (FORM_INPUT_ELEMENTS.has(tagName)) {
        return null
    }

    return container
}

export function getSelectionInfo(): SelectionInfo {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed) {
        return {
            text: "",
            position: null,
            containerElement: null
        }
    }

    const selectedText = selection.toString().trim()

    if (selectedText.length === 0) {
        return {
            text: "",
            position: null,
            containerElement: null
        }
    }

    const position = getBoundingRect()
    const containerElement = getContainerElement()

    return {
        text: selectedText,
        position,
        containerElement
    }
}

export function getBoundingRect(): PositionRect | null {
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) {
        return null
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
    }
}

export function getSelectionRange(): Range | null {
    const selection = window.getSelection()

    if (!selection || selection.rangeCount === 0) {
        return null
    }

    const range = selection.getRangeAt(0)

    if (range.collapsed) {
        return null
    }

    return range
}

export function isOffline(): boolean {
    return !navigator.onLine
}

export function truncateText(
    text: string,
    maxLength: number = MAX_TEXT_LENGTH
): string {
    if (text.length <= maxLength) {
        return text
    }

    return text.slice(0, maxLength).trim() + "..."
}
