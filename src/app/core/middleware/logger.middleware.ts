import { Elysia } from 'elysia'
import { logger, fileLogger, createPinoLogger } from '@bogeychan/elysia-logger'
import { getLogFilePath } from '@shared/util/logger.util'

export const log = createPinoLogger({
  level: 'info',
})

export const loggerMiddleware = () => {
  return new Elysia({ name: 'multi-logger' })
    .use(
      logger({
        level: 'info',
      })
    )
    .use(
      fileLogger({
        level: 'info',
        file: getLogFilePath()
      })
    )
}
