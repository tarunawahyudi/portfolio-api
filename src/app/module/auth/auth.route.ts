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
            captchaToken: t.String(),
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
            captchaToken: t.String(),
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
      .post('/forgot-password', authController.requestPasswordReset.bind(authController), {
        body: t.Object({
          email: t.String({
            format: 'email',
            error: 'Invalid email format'
          }),
          captchaToken: t.String(),
        }),
        detail: {
          tags: ["Authentication"],
          summary: "Request a password reset link",
        },
      })
      .post('/reset-password', authController.resetPassword.bind(authController), {
        body: t.Object({
          token: t.String({ error: 'Token is required' }),
          password: t.String({
            minLength: 6,
            error: 'Password must be at least 6 characters'
          }),
        }),
        detail: {
          tags: ["Authentication"],
          summary: "Reset password with a valid token",
        },
      })
  )
}
