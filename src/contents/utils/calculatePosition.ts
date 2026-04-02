const ICON_SIZE = 36
const GAP = 8
const CARD_WIDTH = 280
const CARD_HEIGHT = 120
const PADDING = 8

export interface Position {
    left: number
    top: number
}

export function calculateIconPosition(range: Range | null): Position {
    if (!range) return { left: 0, top: 0 }

    const rect = range.getBoundingClientRect()
    return {
        left: rect.right,
        top: rect.bottom
    }
}

export function calculateCardPosition(range: Range | null): Position {
    if (!range) return { left: 0, top: 0 }

    const rect = range.getBoundingClientRect()

    const iconX = rect.right
    const iconY = rect.bottom + ICON_SIZE / 2

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    const spaceRight = viewportWidth - rect.right
    const spaceLeft = rect.left

    let left: number
    let top: number

    if (spaceBelow >= CARD_HEIGHT + GAP) {
        left = iconX - CARD_WIDTH / 2
        top = iconY + ICON_SIZE / 2 + GAP
    } else if (spaceAbove >= CARD_HEIGHT + GAP) {
        left = iconX - CARD_WIDTH / 2
        top = iconY - ICON_SIZE / 2 - CARD_HEIGHT - GAP
    } else if (spaceLeft >= CARD_WIDTH + GAP) {
        left = iconX - CARD_WIDTH - GAP
        top = iconY - CARD_HEIGHT / 2
    } else if (spaceRight >= CARD_WIDTH + GAP) {
        left = iconX + GAP
        top = iconY - CARD_HEIGHT / 2
    } else {
        left = Math.max(
            PADDING,
            Math.min(
                iconX - CARD_WIDTH / 2,
                viewportWidth - CARD_WIDTH - PADDING
            )
        )
        top = Math.max(PADDING, rect.bottom + ICON_SIZE + GAP)
    }

    left = Math.max(
        PADDING,
        Math.min(left, viewportWidth - CARD_WIDTH - PADDING)
    )
    top = Math.max(
        PADDING,
        Math.min(top, viewportHeight - CARD_HEIGHT - PADDING)
    )

    return { left, top }
}
