import { Elysia, t } from 'elysia'
import {container} from "tsyringe"
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { SettingControllerImpl } from '@module/setting/controller/setting.controller.impl'

export function registerSettingRoutes(app: Elysia) {
  const settingController = container.resolve(SettingControllerImpl)

  return app.group("/setting", (group) =>
    group
      .get(ROOT, settingController.get.bind(settingController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Setting"],
            summary: "Get list settings of users"
          }
        }
      )
      .post(ROOT, settingController.post.bind(settingController), {
        beforeHandle: authGuard,
        body: t.Object({
          key: t.String(),
          value: t.String()
        }),
        detail: {
          tags: ["Setting"],
          summary: "Create a new setting"
        }
      })
      .get('/:id', settingController.getById.bind(settingController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Setting"],
          summary: "Get a specific setting"
        }
      })
  )
}
