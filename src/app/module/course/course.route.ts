import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { CourseControllerImpl } from '@module/course/controller/course.controller.impl'

export function registerCourseRoutes(app: Elysia) {
  const courseController = container.resolve(CourseControllerImpl)

  const courseBody = t.Object({
    institution: t.String(),
    courseName: t.String(),
    startDate: t.String({ format: 'date' }),
    endDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
    description: t.Optional(t.String()),
  })

  return app.group('/courses', (group) =>
    group
      .get(ROOT, courseController.get.bind(courseController), {
        beforeHandle: authGuard as any,
        query: t.Object({
          page: t.Optional(t.Number({ min: 1 })),
          limit: t.Optional(t.Number({ min: 1, max: 100 })),
        }),
        detail: { tags: ['Course'], summary: 'Get list courses of user' },
      })
      .post(ROOT, courseController.post.bind(courseController), {
        beforeHandle: authGuard,
        body: courseBody,
        detail: { tags: ['Course'], summary: 'Create a new course' },
      })
      .get('/:id', courseController.getById.bind(courseController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Course'], summary: 'Get a specific course' },
      })
      .patch('/:id', courseController.patch.bind(courseController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Partial(courseBody),
        detail: { tags: ['Course'], summary: 'Update a course' },
      })
      .delete('/:id', courseController.delete.bind(courseController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Course'], summary: 'Delete a course' },
      }),
  )
}
