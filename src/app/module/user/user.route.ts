import {Elysia, t} from "elysia"
import {UserControllerImpl} from "@module/user/controller/user.controller.impl"
import {container} from "tsyringe"
import {ROOT} from "@shared/constant/commons.constant"

export function registerUserRoutes(app: Elysia) {
  const userController = container.resolve(UserControllerImpl)

  return app.group("/users", (group) =>
    group
      .post(ROOT, userController.signup.bind(userController), {
          body: t.Object({
            name: t.String({ required: true }),
            username: t.String({ required: true }),
            email: t.String({ required: true, format: "email" }),
            password: t.String({ minLength: 6 }),
          }),
          detail: {
            tags: ["User"],
            summary: "Create a new user"
          }
        }
      )
  )
}
