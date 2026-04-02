import { useEffect } from "react"

interface UseClickOutsideProps {
    isCardVisible: boolean
    hideAll: () => void
    getShadowHostId: () => string
}

export function useClickOutside({
    isCardVisible,
    hideAll,
    getShadowHostId
}: UseClickOutsideProps) {
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
    }, [isCardVisible, hideAll, getShadowHostId])
}
