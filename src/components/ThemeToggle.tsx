import { IconMoon } from "../icons/IconMoon"
import { IconSun } from "../icons/IconSun"

interface ThemeToggleProps {
    theme: "light" | "dark"
    onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    return (
        <div className="theme-toggle-container">
            <div className="theme-info">
                {theme === "light" ? (
                    <IconSun className="icon-theme" />
                ) : (
                    <IconMoon className="icon-theme" />
                )}
                <span className="theme-name">
                    {theme === "light" ? "Light" : "Dark"}
                </span>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={theme === "dark"}
                    onChange={onToggle}
                    aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
                />
                <span className="switch-slider"></span>
            </label>
        </div>
    )
}
