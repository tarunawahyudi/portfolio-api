import { Elysia } from "elysia"
import { setupContainer } from "@core/container"
import { registerUserRoutes } from "@module/user/user.route"
import { startup } from "@core/startup"
import { swaggerPlugin } from "@core/config/swagger.config"
import config from "@core/config"
import cors from "@elysiajs/cors"
import { AppException } from "@core/exception/app.exception"

async function main() {
  await setupContainer()

  const app = new Elysia()
    .onError(({ error, set }) => {
      if (error instanceof AppException) {
        set.status = error.httpStatus
        return {
          code: error.code,
          message: error.message,
          ticket: error.ticketCode,
          timestamp: new Date().toISOString()
        }
      } else {
        set.status = 500
        return { message: "Internal Server Error" }
      }
    })
    .use(swaggerPlugin)

  if (config.cors.enabled) {
    app.use(
      cors({
        origin: config.cors.origin
      })
    )
  }

  app.use(registerUserRoutes)

  startup()
  app.listen(process.env.APP_PORT ?? 8080)
}

main()
