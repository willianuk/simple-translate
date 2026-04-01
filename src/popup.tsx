import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { IconMoon } from "./icons/IconMoon"
import { IconSun } from "./icons/IconSun"
import {
    DEFAULT_FROM_LANG,
    DEFAULT_TO_LANG,
    LANGUAGES
} from "./utils/constants"

import "./popup.css"

type Theme = "light" | "dark"

function IndexPopup() {
    const [theme, setTheme] = useStorage<Theme>("theme", (v) => v ?? "light")
    const [fromLang, setFromLang] = useStorage(
        "fromLang",
        (v) => v ?? DEFAULT_FROM_LANG
    )
    const [toLang, setToLang] = useStorage(
        "toLang",
        (v) => v ?? DEFAULT_TO_LANG
    )
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"))
    }

    const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value

        setFromLang(value)
        setSaved(true)
    }

    const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value

        setToLang(value)
        setSaved(true)
    }

    return (
        <div className="popup-container">
            <h1 className="title">Simple Translate</h1>

            <div className="form-group">
                <label htmlFor="from-lang">Idioma de origen:</label>
                <select
                    id="from-lang"
                    value={fromLang}
                    onChange={handleFromChange}>
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="to-lang">Idioma de destino:</label>
                <select id="to-lang" value={toLang} onChange={handleToChange}>
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

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
                        onChange={toggleTheme}
                        aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
                    />
                    <span className="switch-slider"></span>
                </label>
            </div>

            {saved && <p className="saved-message">✓ Configuración guardada</p>}
        </div>
    )
}

export default IndexPopup
