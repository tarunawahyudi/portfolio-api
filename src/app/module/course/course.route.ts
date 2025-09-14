import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { CourseControllerImpl } from '@module/course/controller/course.controller.impl'

export function registerCourseRoutes(app: Elysia) {
  const courseController = container.resolve(CourseControllerImpl)

  return app.group("/courses", (group) =>
    group
      .get(ROOT, courseController.get.bind(courseController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Course"],
            summary: "Get list courses of users"
          }
        }
      )
      .post(ROOT, courseController.post.bind(courseController), {
        beforeHandle: authGuard,
        body: t.Object({
          institution: t.String(),
          courseName: t.String(),
          startDate: t.String({ format: 'date' }),
          endDate: t.Optional(t.String({ format: 'date' })),
          description: t.Optional(t.String())
        }),
        detail: {
          tags: ["Course"],
          summary: "Create a new course"
        }
      })
      .get('/:id', courseController.getById.bind(courseController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Course"],
          summary: "Get a specific course"
        }
      })
  )
}
