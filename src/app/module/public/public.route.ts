import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { PublicControllerImpl } from '@module/public/controller/public.controller.impl'

export function registerPublicRoutes(app: Elysia) {
  const publicController = container.resolve(PublicControllerImpl)

  return app.group('/public', (group) =>
    group
      .get('/:username', publicController.getByUsername.bind(publicController), {
        params: t.Object({
          username: t.String({ minLength: 3 }),
        }),
        detail: {
          tags: ['Public'],
          summary: "Get a user's complete public profile by username",
        },
      })
      .get('/:username/download-cv', publicController.downloadCv.bind(publicController), {
        detail: {
          tags: ['Public'],
          summary: "Download a user's CV as PDF",
        },
      })
      .get('/portfolio/:id', publicController.getPortfolioById.bind(publicController), {
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Public'], summary: 'Get a single public portfolio detail' },
      }),
  )
}
