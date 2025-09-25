import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { SkillControllerImpl } from '@module/skill/controller/skill.controller.impl'

export function registerSkillRoutes(app: Elysia) {
  const skillController = container.resolve(SkillControllerImpl)

  return app.group('/skills', (group) =>
    group
      .get(ROOT, skillController.get.bind(skillController), {
        beforeHandle: authGuard as any,
        query: t.Object({
          page: t.Optional(t.Number({ default: 1, minimum: 1 })),
          limit: t.Optional(t.Number({ default: 10, minimum: 1 })),
        }),
        detail: { tags: ['Skill'], summary: 'Get list skill of users' },
      })
      .post(ROOT, skillController.post.bind(skillController), {
        beforeHandle: authGuard,
        body: t.Object({
          name: t.String({ minLength: 2, maxLength: 100 }),
          proficiency: t.Number({ min: 0, max: 100 }),
          category: t.String({ minLength: 2 }),
        }),
        detail: { tags: ['Skill'], summary: 'Create a new skill' },
      })
      .get('/:id', skillController.getById.bind(skillController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Skill'], summary: 'Get skill by id' },
      })
      .patch('/:id', skillController.patch.bind(skillController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({
          name: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
          proficiency: t.Optional(t.Number({ min: 0, max: 100 })),
          category: t.Optional(t.String({ minLength: 2 })),
        }),
        detail: { tags: ['Skill'], summary: 'Update a skill' },
      })
      .delete('/:id', skillController.delete.bind(skillController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Skill'], summary: 'Delete a skill' },
      }),
  )
}
