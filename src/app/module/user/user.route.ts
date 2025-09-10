import { Elysia } from 'elysia'
import {UserControllerImpl} from "@module/user/controller/user.controller.impl"
import {container} from "tsyringe"

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
  )
}
