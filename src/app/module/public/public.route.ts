import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { PublicControllerImpl } from '@module/public/controller/public.controller.impl'
import { rateLimit } from 'elysia-rate-limit'

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
      })
      .get('/article/:slug', publicController.getArticleBySlug.bind(publicController), {
        params: t.Object({ slug: t.String() }),
        detail: { tags: ["Public"], summary: "Get a single published article by slug" }
      })
      .use(rateLimit({ duration: 60 * 1000, max: 3 }))
      .post('/contact/:username', publicController.sendContactMessage.bind(publicController), {
        body: t.Object({
          name: t.String({ minLength: 2 }),
          email: t.String({ format: 'email' }),
          subject: t.String({ minLength: 3 }),
          message: t.String(),
        }),
        params: t.Object({ username: t.String() }),
        detail: { tags: ["Public"], summary: "Send a contact message to a user" }
      })
  )
}
