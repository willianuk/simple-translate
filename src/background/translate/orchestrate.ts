import type { Logger } from "~/background/shared/logger"
import type { TranslateRequest } from "~/types"
import { MAX_TEXT_LENGTH } from "~/utils/constants"

import { executeTranslation, getTranslationLanguages } from "~/background/translate/execute"
import { normalizeText, validateText, validateTextLength } from "~/background/translate/validate"

export async function orchestrateTranslation(
    request: TranslateRequest,
    logger: Logger
): Promise<string> {
    logger.debug("Starting translation orchestration")

    // Step 1: Validate and normalize
    const text = validateText(request.text)
    const normalizedText = normalizeText(text)
    validateTextLength(normalizedText, MAX_TEXT_LENGTH)
    logger.debug("Text validated", { textLength: normalizedText.length })

    // Step 2: Resolve languages
    const { from, to } = await getTranslationLanguages(
        request.fromLang,
        request.toLang,
        logger
    )
    logger.debug("Languages resolved", { from, to })

    // Step 3: Execute translation
    logger.info("Translation started", {
        from,
        to,
        textLength: normalizedText.length
    })
    const result = await executeTranslation(normalizedText, from, to)
    logger.info("Translation completed", { from, to })

    return result
}
