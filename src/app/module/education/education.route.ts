import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { EducationControllerImpl } from '@module/education/controller/education.controller.impl'

export function registerEducationRoutes(app: Elysia) {
  const educationController = container.resolve(EducationControllerImpl)

  return app.group("/education", (group) =>
    group
      .get(ROOT, educationController.get.bind(educationController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Education"],
            summary: "Get list education of users"
          }
        }
      )
      .post(ROOT, educationController.post.bind(educationController), {
        beforeHandle: authGuard,
        body: t.Object({
          institution: t.String({ maxLength: 100 }),
          degree: t.String({ maxLength: 50 }),
          fieldOfStudy: t.String(),
          grade: t.Optional(t.String()),
          startDate: t.String({ format: 'date' }),
          endDate: t.Optional(t.String({ format: 'date' })),
          description: t.Optional(t.String())
        }),
        detail: {
          tags: ["Education"],
          summary: "Create a education of user"
        }
      })
      .get('/:id', educationController.getById.bind(educationController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Education"],
          summary: "Get detail of user"
        }
      })
      .patch('/:id', educationController.update.bind(educationController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: "Invalid ID format" })
        }),
        body: t.Object({
          institution: t.Optional(t.String({ maxLength: 100 })),
          degree: t.Optional(t.String({ maxLength: 50 })),
          fieldOfStudy: t.Optional(t.String()),
          grade: t.Optional(t.String()),
          startDate: t.Optional(t.String({ format: 'date' })),
          endDate: t.Optional(t.String({ format: 'date' })),
          description: t.Optional(t.String())
        }),
        detail: {
          tags: ["Education"],
          summary: "Update an education record"
        }
      })
      .delete('/:id', educationController.delete.bind(educationController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: "Invalid ID format" })
        }),
        detail: {
          tags: ["Education"],
          summary: "Delete an education record"
        }
      })
  )
}
