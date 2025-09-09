import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { AuthControllerImpl } from '@module/auth/controller/auth.controller.impl'
import { authGuard } from '@core/middleware/auth.middleware'

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
      .post("/sign-in", (ctx) => authController.postSignIn(ctx), {
          body: t.Object({
            usernameOrEmail: t.String(),
            password: t.String(),
          }),
          detail: {
            tags: ["Authentication"],
            summary: "Sign in to get tokens"
          }
        }
      )

      .post("/refresh", (ctx) => authController.postRefreshToken(ctx), {
          detail: {
            tags: ["Authentication"],
            summary: "Get a new access token using a refresh token"
          }
        }
      )

      .post("/sign-out", (ctx) => authController.postSignOut(ctx), {
          beforeHandle: authGuard,
          detail: {
            tags: ["Authentication"],
            summary: "Sign out and invalidate refresh token"
          }
        }
      )
  )
}
