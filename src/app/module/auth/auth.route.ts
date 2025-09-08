import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { AuthControllerImpl } from '@module/auth/controller/auth.controller.impl'

export function registerAuthRoutes(app: Elysia) {
  const authController = container.resolve(AuthControllerImpl)

  return app.group("/auth", (group) =>
    group
      .get("/verify", authController.getEmailVerification.bind(authController), {
          query: t.Object({
            token: t.String(),
            uid: t.String(),
          }),
          detail: {
            tags: ["Authentication"],
            summary: "Verify email token"
          }
        }
      )
  )
}
