import type { PlasmoMessaging } from "@plasmohq/messaging"

import { translate } from "../../services/reverso"
import { getFromLang, getToLang } from "../../services/storage"
import type { TranslateRequest, TranslateResponse } from "../../types"
import { MAX_TEXT_LENGTH } from "../../utils/constants"

type HandlerRequest = PlasmoMessaging.Request<"translate", TranslateRequest>
type HandlerResponse = PlasmoMessaging.Response<TranslateResponse>

const handler: PlasmoMessaging.MessageHandler<
    TranslateRequest,
    TranslateResponse
> = async (request: HandlerRequest, response: HandlerResponse) => {
    const { text, fromLang, toLang } = request.body ?? {}

    if (!text || typeof text !== "string") {
        response.send({ error: "El texto no puede estar vacío" })
        return
    }

    const trimmedText = text.trim()

    if (trimmedText.length === 0) {
        response.send({ error: "El texto no puede estar vacío" })
        return
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
        response.send({
            error: `El texto excede el límite de ${MAX_TEXT_LENGTH} caracteres`
        })
        return
    }

    try {
        const from = fromLang ?? (await getFromLang())
        const to = toLang ?? (await getToLang())

        console.log("Backgound trimed text: ", trimmedText)

        const translatedText = await translate(trimmedText, from, to)
        response.send({ translatedText })
    } catch (error) {
        console.error("Background: Translation error", error)
        response.send({ error: "Error de traducción" })
    }
}

export default handler
