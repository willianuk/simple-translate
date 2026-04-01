import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

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
            <div className="header">
                <h1 className="title">Simple Translate</h1>
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}>
                    {theme === "light" ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    )}
                </button>
            </div>

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

            {saved && <p className="saved-message">✓ Configuración guardada</p>}
        </div>
    )
}

export default IndexPopup
