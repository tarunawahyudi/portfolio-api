import { Elysia } from "elysia"
import { startupConfig } from "@core/config/startup.config"
import { swaggerPlugin } from "@core/config/swagger.config"
import { loggerMiddleware } from '@core/middleware/logger.middleware'
import { errorMiddleware } from '@core/middleware/error.middleware'
import { corsMiddleware } from '@core/middleware/cors.middleware'
import { cookie } from '@elysiajs/cookie'
import { setupContainer } from '@module/app.container'
import { ApplicationRoutes } from '@module/app.route'

/**
 * Application entry point.
 *
 * Initializes the dependency container, registers middlewares,
 * sets up routes, and starts the HTTP server.
 */
async function main() {
  // Initialize dependency injection container
  await setupContainer()

  const app = new Elysia()
    .use(cookie())
    /**
     * Global logger middleware
     * Handles logging for all incoming requests and system events
     */
    .use(loggerMiddleware)

    /**
     * CORS middleware
     * Enables Cross-Origin Resource Sharing based on configured policies
     */
    .use(corsMiddleware())

    /**
     * Swagger API documentation plugin
     * Automatically generates and serves OpenAPI documentation
     */
    .use(swaggerPlugin)

    /**
     * Global error handler
     * Catches exceptions and returns standardized error responses
     */
    .use(errorMiddleware)

    /**
     * Application routes
     * Registers all route handlers for the User module
     */
    .use(ApplicationRoutes)

  // Run startup tasks
  startupConfig()

  // Start HTTP server
  app.listen(process.env.APP_PORT ?? 8080)
}

main()
