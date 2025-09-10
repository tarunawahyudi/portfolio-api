import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { AuthControllerImpl } from '@module/auth/controller/auth.controller.impl'
import { authGuard } from '@core/middleware/auth.middleware'

export function registerAuthRoutes(app: Elysia) {
  const authController = container.resolve(AuthControllerImpl)

  return app.group("/auth", (group) =>
    group
      .get("/me", authController.getProfileInfo.bind(authController), {
        beforeHandle: authGuard,
        detail: {
          tags: ["Authentication"],
          summary: "Get profile information",
        }
      })
      .post("/sign-up", authController.postSignUp.bind(authController), {
          body: t.Object({
            name: t.String({ required: true }),
            username: t.String({ required: true }),
            email: t.String({ required: true, format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
          detail: {
            tags: ["Authentication"],
            summary: "Register a new user"
          }
        }
      )
      .post("/sign-in", (ctx) => authController.postSignIn(ctx), {
          body: t.Object({
            usernameOrEmail: t.String(),
            password: t.String({ minLength: 6 }),
          }),
          detail: {
            tags: ["Authentication"],
            summary: "Sign in to get tokens"
          }
        }
      )
      .get("/verify", authController.getEmailVerification.bind(authController), {
          query: t.Object({
            token: t.String(),
            uid: t.String({ format: 'uuid' }),
          }),
          detail: {
            tags: ["Authentication"],
            summary: "Verify email token"
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
