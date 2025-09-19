import { Elysia, t } from 'elysia'
import {container} from "tsyringe"
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { AwardControllerImpl } from '@module/award/controller/award.controller.impl'

export function registerAwardRoutes(app: Elysia) {
  const awardController = container.resolve(AwardControllerImpl)
  const awardBody = t.Object({ title: t.String(), description: t.Optional(t.String()) })

  return app.group("/awards", (group) =>
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
        body: awardBody,
        detail: { tags: ["Award"], summary: "Create a new award" }
      })
      .get('/:id', awardController.getById.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Award"],
          summary: "Get a specific award"
        }
      })
      .patch('/:id', awardController.patch.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Partial(awardBody),
        detail: { tags: ["Award"], summary: "Update an award" }
      })
      .delete('/:id', awardController.delete.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ["Award"], summary: "Delete an award" }
      })
      .post('/:id/images', awardController.uploadImages.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({ images: t.Files({ type: 'image', maxSize: '5m' }) }),
        detail: { tags: ["Award"], summary: "Upload images to an award" }
      })
      .delete('/:id/images', awardController.removeImage.bind(awardController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({ imageKey: t.String() }),
        detail: { tags: ["Award"], summary: "Remove an image from an award" }
      })
  )
}
