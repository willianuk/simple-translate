type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
    timestamp: string
    level: LogLevel
    context: string
    message: string
    metadata?: Record<string, unknown>
}

export interface Logger {
    debug(message: string, metadata?: Record<string, unknown>): void
    info(message: string, metadata?: Record<string, unknown>): void
    warn(message: string, metadata?: Record<string, unknown>): void
    error(
        message: string,
        error?: unknown,
        metadata?: Record<string, unknown>
    ): void
}

const isDev =
    process.env.NODE_ENV === "development" ||
    process.env.PLASMO_ENV === "development"

function log(
    level: LogLevel,
    context: string,
    message: string,
    metadata?: Record<string, unknown>
): void {
    const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        context,
        message,
        metadata
    }

    const consoleMethod = console[level] || console.log
    consoleMethod(`[${entry.timestamp}] [${level.toUpperCase()}] ${context}: ${message}`, metadata || "")
}

export function createLogger(context: string): Logger {
    return {
        debug: isDev
            ? (message, metadata) => log("debug", context, message, metadata)
            : () => {},
        info: (message, metadata) => log("info", context, message, metadata),
        warn: (message, metadata) => log("warn", context, message, metadata),
        error: (message, error, metadata) => {
            const errorMetadata = {
                ...metadata,
                error:
                    error instanceof Error
                        ? {
                              name: error.name,
                              message: error.message,
                              stack: error.stack
                          }
                        : error
            }
            log("error", context, message, errorMetadata)
        }
    }
}
