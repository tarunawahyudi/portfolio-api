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
            status: t.Optional(t.UnionEnum(['draft', 'published']))
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
          status: t.Optional(t.UnionEnum(['draft', 'published']))
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
      .post('/:id/thumbnail', articleController.postThumbnail.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: 'Invalid article ID format' })
        }),
        body: t.Object({
          thumbnail: t.File({
            type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            maxSize: '5m'
          })
        }),
        detail: {
          tags: ["Article"],
          summary: "Upload a thumbnail for a specific article"
        }
      })
      .patch('/:id/status', articleController.patchStatus.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: 'Invalid article ID format' })
        }),
        body: t.Object({
          status: t.UnionEnum(['draft', 'published'])
        }),
        detail: {
          tags: ["Article"],
          summary: "Set article status update"
        }
      })
  )
}
