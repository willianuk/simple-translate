import type { PlasmoMessaging } from "@plasmohq/messaging"

import { translate } from "../../services/reverso"
import { getFromLang, getToLang } from "../../services/storage"
import { MAX_TEXT_LENGTH } from "../../utils/constants"

interface TranslationRequestBody {
  text: string
  fromLang?: string
  toLang?: string
}

interface TranslationResponseBody {
  translatedText: string
}

interface ErrorResponseBody {
  error: string
}

type HandlerRequest = PlasmoMessaging.Request<
  "translate",
  TranslationRequestBody
>
type HandlerResponse = PlasmoMessaging.Response<
  TranslationResponseBody | ErrorResponseBody
>

const handler: PlasmoMessaging.MessageHandler<
  TranslationRequestBody,
  TranslationResponseBody | ErrorResponseBody
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

    const translatedText = await translate(trimmedText, from, to)

    response.send({ translatedText })
  } catch (error) {
    console.error("Background: Translation error", error)

    if (
      error instanceof Error &&
      (error.name === "ReversoNetworkError" ||
        error.message.includes("Failed to connect"))
    ) {
      response.send({ error: "Sin conexión" })
      return
    }

    if (error instanceof Error && error.name === "ReversoEmptyResponseError") {
      response.send({ error: "Error de traducción" })
      return
    }

    if (error instanceof Error && error.name === "ReversoTranslationError") {
      response.send({ error: "Error de traducción" })
      return
    }

    response.send({ error: "Error de traducción" })
  }
}

export default handler
