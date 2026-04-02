import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { LanguageSelector } from "./components/LanguageSelector"
import { ThemeToggle } from "./components/ThemeToggle"
import { DEFAULT_FROM_LANG, DEFAULT_TO_LANG } from "./utils/constants"

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

            <LanguageSelector
                id="from-lang"
                label="Idioma de origen:"
                value={fromLang}
                onChange={handleFromChange}
            />

            <LanguageSelector
                id="to-lang"
                label="Idioma de destino:"
                value={toLang}
                onChange={handleToChange}
            />

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            {saved && <p className="saved-message">✓ Configuración guardada</p>}
        </div>
    )
}

export default IndexPopup
