import { Elysia } from 'elysia'
import { logger } from '@shared/util/logger.util'

export const loggerMiddleware = (app: Elysia) =>
  app.onAfterHandle(({ response, request }) => {
    const { method, url } = request
    const status = (response as { code: number }).code
    const path = new URL(url).pathname
    const logMessage = `${method} ${path} ${status}`
    logger.info(logMessage)
  })
