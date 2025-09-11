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
  )
}
