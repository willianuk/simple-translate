import { LANGUAGES } from "../utils/constants"

interface LanguageSelectorProps {
    id: string
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function LanguageSelector({
    id,
    label,
    value,
    onChange
}: LanguageSelectorProps) {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value} onChange={onChange}>
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    )
}
