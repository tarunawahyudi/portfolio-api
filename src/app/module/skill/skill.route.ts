import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { SkillControllerImpl } from '@module/skill/controller/skill.controller.impl'

export function registerSkillRoutes(app: Elysia) {
  const skillController = container.resolve(SkillControllerImpl)

  return app.group("/skills", (group) =>
    group
      .get(ROOT, skillController.get.bind(skillController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Skill"],
            summary: "Get list skill of users"
          }
        }
      )
      .post(ROOT, skillController.post.bind(skillController), {
        beforeHandle: authGuard,
        body: t.Object({
          name: t.String({ maxLength: 100 }),
          proficiency: t.Number(),
          category: t.String()
        }),
        detail: {
          tags: ["Skill"],
          summary: "Create a new skill"
        }
      })
      .get('/:id', skillController.getById.bind(skillController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Skill"],
          summary: "Get skill by id"
        }
      })
  )
}
