import cors from "@elysiajs/cors"
import config from "@core/config"
import { Elysia } from 'elysia'

export const corsMiddleware = () => {
  const noopPlugin = new Elysia({ name: "noop-cors" })

  if (!config.cors.enabled) {
    return noopPlugin
  }

  return cors({
    origin: '*'
  })
}
