import type { Logger } from "~/background/shared/logger"
import { mapReversoError } from "~/background/shared/errors"
import { translate } from "~/services/reverso"
import { getFromLang, getToLang } from "~/services/storage"
import { DEFAULT_FROM_LANG, DEFAULT_TO_LANG } from "~/utils/constants"

import { isValidLanguage } from "~/background/translate/validate"

export async function getTranslationLanguages(
    fromLang?: string,
    toLang?: string,
    logger?: Logger
): Promise<{ from: string; to: string }> {
    let from = fromLang
    let to = toLang

    if (fromLang && !isValidLanguage(fromLang)) {
        logger?.warn("Invalid source language, using default", {
            provided: fromLang,
            fallback: DEFAULT_FROM_LANG
        })
        from = undefined
    }

    if (toLang && !isValidLanguage(toLang)) {
        logger?.warn("Invalid target language, using default", {
            provided: toLang,
            fallback: DEFAULT_TO_LANG
        })
        to = undefined
    }

    return {
        from: from ?? (await getFromLang()),
        to: to ?? (await getToLang())
    }
}

export async function executeTranslation(
    text: string,
    from: string,
    to: string
): Promise<string> {
    try {
        return await translate(text, from, to)
    } catch (error) {
        throw mapReversoError(error)
    }
}
