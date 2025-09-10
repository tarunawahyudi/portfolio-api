import { Elysia } from 'elysia'
import { authGuard } from '@core/middleware/auth.middleware'

export function registerAppRoute(app: Elysia) {
  return app.get('/hello', 'Hello world!', {
    beforeHandle: authGuard,
    detail: {
      tags: ["Hello World"],
      summary: "Test of API application",
    }
  })
}
