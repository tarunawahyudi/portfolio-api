import { Elysia } from 'elysia'
import { logger } from '@shared/util/logger.util'
import { AppException } from '@core/exception/app.exception'

export const errorMiddleware = (app: Elysia) =>
  app.onError(({ error, set, request }) => {
    const { method, url } = request
    const path = new URL(url).pathname

    if (error instanceof AppException) {
      const logFn = (logger as any)[error.logLevel] || logger.error
      logFn(`${method} ${path} ${error.httpStatus} - ${error.message}`)
      set.status = error.httpStatus
      return {
        code: error.code,
        message: error.message,
        ticket: error.ticketCode,
        timestamp: new Date().toISOString()
      }
    } else {
      const message = error instanceof Error
        ? error.message
        : "Internal Server Error"

      logger.error(`${method} ${path} 500 - ${message}`)
      set.status = 500
      return { message: "Internal Server Error" }
    }
  })
