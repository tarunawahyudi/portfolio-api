import { Elysia, t } from 'elysia'
import {container} from "tsyringe"
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { AwardControllerImpl } from '@module/award/controller/award.controller.impl'

export function registerAwardRoutes(app: Elysia) {
  const awardController = container.resolve(AwardControllerImpl)

  return app.group("/award", (group) =>
    group
      .get(ROOT, awardController.get.bind(awardController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Award"],
            summary: "Get list awards of users"
          }
        }
      )
      .post(ROOT, awardController.post.bind(awardController), {
        beforeHandle: authGuard,
        body: t.Object({
          title: t.String(),
          description: t.Optional(t.String())
        }),
        detail: {
          tags: ["Award"],
          summary: "Create a new award"
        }
      })
      .get('/:id', awardController.getById.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Award"],
          summary: "Get a specific award"
        }
      })
  )
}
