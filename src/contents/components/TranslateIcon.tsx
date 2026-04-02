import styles from "../translate-widget.module.css"

export interface TranslateIconProps {
    position: {
        left: number
        top: number
    }
    isVisible: boolean
    theme: "light" | "dark"
    onClick: () => void
}

export default function TranslateIcon({
    position,
    isVisible,
    theme,
    onClick
}: TranslateIconProps) {
    return (
        <div
            data-icon
            data-theme={theme}
            className={styles.icon}
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none"
            }}
            onClick={onClick}>
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M2 12h20" />
                <path d="M12 2c3 3 3 8 3 10s0 7-3 10" />
                <path d="M12 2c-3 3-3 8-3 10s0 7 3 10" />
            </svg>
        </div>
    )
}
