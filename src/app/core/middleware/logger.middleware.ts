// logger.middleware.ts
import { Elysia } from "elysia"
import { customLogger } from '@shared/util/logger.util'

export const loggerMiddleware = new Elysia({ name: "logger" })
  .onBeforeHandle(({ request }) => {
    // Log informasi request yang masuk
    customLogger.info(`[REQ] ${request.method} ${request.url}`)
  })
  .onAfterHandle(({ request, response }) => {
    // Log informasi response yang keluar
    const status = response instanceof Response ? response.status : 200
    customLogger.info(`[RES] ${request.method} ${request.url} - ${status}`)
  })
  .onError(({ error }) => {
    // Log error yang terjadi
    let errorMessage = "Unknown Error"

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = error.message
    }

    customLogger.error(`[ERR] ${errorMessage}`)
  })
