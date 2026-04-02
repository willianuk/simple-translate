import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const storage = new Storage()

        const loadTheme = async () => {
            const savedTheme = await storage.get("theme")
            setTheme((savedTheme as "light" | "dark") ?? "light")
        }

        loadTheme()

        storage.watch({
            theme: (change) => {
                const newTheme =
                    (change.newValue as "light" | "dark") ?? "light"
                setTheme(newTheme)
            }
        })

        return () => {
            storage.unwatch({
                theme: () => {}
            })
        }
    }, [])

    return { theme }
}
