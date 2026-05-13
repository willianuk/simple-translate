import type { PlasmoMessaging } from "@plasmohq/messaging"

import { BackgroundError, ErrorCode } from "~/background/shared/errors"
import { createLogger } from "~/background/shared/logger"
import type { TranslateRequest, TranslateResponse } from "~/types"

import { formatErrorResponse, formatSuccessResponse } from "~/background/translate/format"
import { orchestrateTranslation } from "~/background/translate/orchestrate"

type HandlerRequest = PlasmoMessaging.Request<"translate", TranslateRequest>
type HandlerResponse = PlasmoMessaging.Response<TranslateResponse>

const handler: PlasmoMessaging.MessageHandler<
    TranslateRequest,
    TranslateResponse
> = async (request: HandlerRequest, response: HandlerResponse) => {
    const logger = createLogger("translate-handler")

    try {
        const result = await orchestrateTranslation(request.body, logger)
        response.send(formatSuccessResponse(result))
    } catch (error) {
        if (error instanceof BackgroundError) {
            logger.error("Translation failed", error, {
                code: error.context.code,
                retryable: error.context.retryable
            })
            response.send(formatErrorResponse(error))
        } else {
            logger.error("Unexpected error in handler", error)
            response.send(
                formatErrorResponse(
                    new BackgroundError({
                        code: ErrorCode.UNKNOWN_ERROR,
                        userMessage: "Error inesperado",
                        technicalMessage:
                            error instanceof Error
                                ? error.message
                                : String(error),
                        recoverable: false,
                        retryable: false
                    })
                )
            )
        }
    }
}

export default handler
