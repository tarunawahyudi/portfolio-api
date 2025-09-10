import { Elysia, t } from 'elysia'
import {UserControllerImpl} from "@module/user/controller/user.controller.impl"
import {container} from "tsyringe"
import { authGuard } from '@core/middleware/auth.middleware'

export function registerUserRoutes(app: Elysia) {
  const userController = container.resolve(UserControllerImpl)

  return app.group("/users", (group) =>
    group
      .get('/:username', userController.getByUsername.bind(userController), {
          detail: {
            tags: ["User"],
            summary: "Get user by username"
          }
        }
      )
      .patch('/profile', userController.putProfile.bind(userController), {
        beforeHandle: authGuard,
        body: t.Object({
          fullName: t.Optional(t.String({ maxLength: 100 })),
          displayName: t.Optional(t.String({ maxLength: 50 })),
          phoneNumber: t.Optional(t.String({ maxLength: 20, minLength: 5 })),
          bio: t.Optional(t.String()),
          address: t.Optional(t.String()),
          website: t.Optional(t.String({ maxLength: 100 })),
          socials: t.Optional(t.Record(t.String(), t.String())),
          hobbies: t.Optional(t.Array(t.String()))
        }),
        detail: {
          tags: ["User"],
          summary: "Update the current user's profile"
        }
      })
      .post('/avatar', userController.uploadAvatar.bind(userController), {
        beforeHandle: authGuard,
        body: t.Object({
          avatar: t.File({
            maxSize: '5m',
            type: ['image/jpeg', 'image/png', 'image/webp'],
          })
        }),
        detail: {
          tags: ["User"],
          summary: "Upload or update the current user's avatar"
        }
      })
  )
}
