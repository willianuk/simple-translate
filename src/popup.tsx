import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { LANGUAGES } from "./utils/constants"

import "./popup.css"

function IndexPopup() {
  const [fromLang, setFromLang] = useStorage("fromLang", (v) => v ?? "spa")
  const [toLang, setToLang] = useStorage("toLang", (v) => v ?? "eng")
  const [saved, setSaved] = useState(false)

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
        <select id="from-lang" value={fromLang} onChange={handleFromChange}>
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
