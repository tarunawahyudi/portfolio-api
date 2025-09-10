import { Elysia, t } from 'elysia'
import {container} from "tsyringe"
import { WorkExperienceControllerImpl } from '@module/work-experience/controller/work-experience.controller.impl'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'

export function registerWorkerExperienceRoutes(app: Elysia) {
  const workExperienceController = container.resolve(WorkExperienceControllerImpl)

  return app.group("/work-experience", (group) =>
    group
      .get(ROOT, workExperienceController.get.bind(workExperienceController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Work Experience"],
            summary: "Get list work experience of users"
          }
        }
      )
      .post(ROOT, workExperienceController.post.bind(workExperienceController), {
        beforeHandle: authGuard,
        body: t.Object({
          company: t.String(),
          position: t.String(),
          startDate: t.String({ format: 'date' }),
          endDate: t.Optional(t.String({ format: 'date' })),
          isCurrent: t.Optional(t.Boolean()),
          jobDescription: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Work Experience"],
          summary: "Create a new work experience"
        }
      })
      .put('/:id', workExperienceController.put.bind(workExperienceController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        body: t.Object({
          company: t.Optional(t.String()),
          position: t.Optional(t.String()),
          startDate: t.Optional(t.String()),
          endDate: t.Optional(t.String()),
          isCurrent: t.Optional(t.Boolean()),
          jobDescription: t.Optional(t.String())
        }),
        detail: {
          tags: ["Work Experience"],
          summary: "Update a specific work experience"
        }
      })
      .delete('/:id', workExperienceController.delete.bind(workExperienceController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid' })
        }),
        detail: {
          tags: ["Work Experience"],
          summary: "Delete a specific work experience"
        }
      })
  )
}
