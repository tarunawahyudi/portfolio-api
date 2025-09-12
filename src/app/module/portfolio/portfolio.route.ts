import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { PortfolioControllerImpl } from '@module/portfolio/controller/portfolio.controller.impl'

export function registerPortfolioRoutes(app: Elysia) {
  const portfolioController = container.resolve(PortfolioControllerImpl)

  return app.group("/portfolios", (group) =>
    group
      .get(ROOT, portfolioController.get.bind(portfolioController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Portfolio"],
            summary: "Get list portfolio of users"
          }
        }
      )
      .get('/:id', portfolioController.getById.bind(portfolioController), {
        params: t.Object({
          id: t.String({ format: 'uuid' })
        }),
        detail: {
          tags: ["Portfolio"],
          summary: "Get detail of portfolio"
        }
      })
      .post(ROOT, portfolioController.post.bind(portfolioController), {
        beforeHandle: authGuard,
        body: t.Object({
          title: t.String({ maxLength: 100 }),
          description: t.Optional(t.String()),
          techStack: t.Array(t.String())
        }),
        detail: {
          tags: ["Portfolio"],
          summary: "Create a new portfolio"
        }
      })
      .patch('/:id', portfolioController.patch.bind(portfolioController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: 'Invalid portfolio ID format' })
        }),
        body: t.Object({
          title: t.Optional(t.String({ maxLength: 100 })),
          description: t.Optional(t.String()),
          techStack: t.Optional(t.Array(t.String()))
        }),
        detail: {
          tags: ["Portfolio"],
          summary: "Update an existing portfolio"
        }
      })
      .delete('/:id', portfolioController.delete.bind(portfolioController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: 'Invalid portfolio ID format' })
        }),
        detail: {
          tags: ["Portfolio"],
          summary: "Delete a portfolio"
        }
      })
      .post('/:id/thumbnail', portfolioController.uploadThumbnail.bind(portfolioController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid', error: 'Invalid portfolio ID format' })
        }),
        body: t.Object({
          thumbnail: t.File({
            type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            maxSize: '5m'
          })
        }),
        detail: {
          tags: ["Portfolio"],
          summary: "Upload a thumbnail for a specific portfolio"
        }
      })
  )
}
