import { Storage } from "@plasmohq/storage"

import { DEFAULT_FROM_LANG, DEFAULT_TO_LANG } from "../utils/constants"

const storage = new Storage()

export async function getFromLang(): Promise<string> {
    const value = await storage.get("fromLang")
    return value ?? DEFAULT_FROM_LANG
}

export async function getToLang(): Promise<string> {
    const value = await storage.get("toLang")
    return value ?? DEFAULT_TO_LANG
}
