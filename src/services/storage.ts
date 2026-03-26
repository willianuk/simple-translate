import { Storage } from "@plasmohq/storage"

import { DEFAULT_FROM_LANG, DEFAULT_TO_LANG } from "../utils/constants"

const storage = new Storage()

const FROM_LANG_KEY = "fromLang"
const TO_LANG_KEY = "toLang"

export async function getFromLang(): Promise<string> {
  const value = await storage.get(FROM_LANG_KEY)
  return value ?? DEFAULT_FROM_LANG
}

export async function getToLang(): Promise<string> {
  const value = await storage.get(TO_LANG_KEY)
  return value ?? DEFAULT_TO_LANG
}

export async function setFromLang(value: string): Promise<void> {
  await storage.set(FROM_LANG_KEY, value)
}

export async function setToLang(value: string): Promise<void> {
  await storage.set(TO_LANG_KEY, value)
}
