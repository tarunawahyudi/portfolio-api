import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { ArticleControllerImpl } from '@module/article/controller/article.controller.impl'
import { articleStatusEnum } from '@db/schema'

export function registerArticleRoutes(app: Elysia) {
  const articleController = container.resolve(ArticleControllerImpl)

  const articleBody = t.Object({
    title: t.String(),
    slug: t.String(),
    content: t.String(),
    tags: t.Optional(t.Array(t.String())),
    status: t.Optional(t.UnionEnum(['draft', 'published'])),
    isFeatured: t.Optional(t.Boolean()),
  })

  return app.group('/articles', (group) =>
    group
      .get(ROOT, articleController.get.bind(articleController), {
        beforeHandle: authGuard as any,
        query: t.Object({
          page: t.Optional(t.Number({ default: 1, minimum: 1 })),
          limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
          status: t.Optional(t.UnionEnum(articleStatusEnum.enumValues)),
        }),
        detail: { tags: ['Article'], summary: 'Get list articles of user' },
      })
      .post(ROOT, articleController.post.bind(articleController), {
        beforeHandle: authGuard,
        body: articleBody,
        detail: { tags: ['Article'], summary: 'Create a new article' },
      })
      .get('/:id', articleController.getById.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Article'], summary: 'Get a specific article' },
      })
      .patch('/:id', articleController.patch.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Partial(articleBody),
        detail: { tags: ['Article'], summary: 'Update an article' },
      })
      .post('/:id/thumbnail', articleController.postThumbnail.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({ thumbnail: t.File({ type: 'image', maxSize: '5m' }) }),
        detail: { tags: ['Article'], summary: 'Upload article thumbnail' },
      })
      .patch('/:id/status', articleController.patchStatus.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({ status: t.UnionEnum(articleStatusEnum.enumValues) }),
        detail: { tags: ['Article'], summary: 'Update article status' },
      })
      .delete('/:id', articleController.delete.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Article'], summary: 'Move article to trash (soft delete)' },
      })
      .post('/:id/restore', articleController.restore.bind(articleController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Article'], summary: 'Restore article from trash' },
      }),
  )
}
