import { Elysia, t } from 'elysia'
import {container} from "tsyringe"
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { ArticleControllerImpl } from '@module/article/controller/article.controller.impl'

export function registerArticleRoutes(app: Elysia) {
  const articleController = container.resolve(ArticleControllerImpl)

  return app.group("/article", (group) =>
    group
      .get(ROOT, articleController.get.bind(articleController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Article"],
            summary: "Get list article of users"
          }
        }
      )
      .post(ROOT, articleController.post.bind(articleController), {
        beforeHandle: authGuard,
        body: t.Object({
          title: t.String(),
          slug: t.String({ maxLength: 100 }),
          content: t.String(),
          tags: t.Optional(t.Array(t.String())),
        }),
        detail: {
          tags: ["Article"],
          summary: "Create a new article"
        }
      })
      .get('/:id', articleController.getById.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Article"],
          summary: "Get a specific artcile"
        }
      })
  )
}
