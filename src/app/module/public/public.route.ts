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
        query: t.Object({
          lang: t.Optional(t.String())
        }),
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
      .get('/portfolios/by-username/:username', publicController.getPortfoliosByUsername.bind(publicController), {
        params: t.Object({ username: t.String() }),
        query: t.Object({
          page: t.Optional(t.Number({ default: 1, minimum: 1 })),
          limit: t.Optional(t.Number({ default: 9, minimum: 1 })),
          search: t.Optional(t.String()),
          category: t.Optional(t.String()),
        }),
        detail: { tags: ["Public"], summary: "Get a user's all public portfolios with filter & pagination" }
      })
      .get('/certificates/by-username/:username', publicController.getCertificatesByUsername.bind(publicController), {
        params: t.Object({ username: t.String() }),
        query: t.Object({
          page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
          limit: t.Optional(t.Numeric({ default: 9, minimum: 1, maximum: 100 })),
          search: t.Optional(t.String()),
        }),
        detail: { tags: ["Public"], summary: "Get a user's all public certificates with filter & pagination" }
      })
      .get('/certificate/:id', publicController.getCertificateById.bind(publicController), {
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Public'], summary: "Get a single public certificate detail" }
      })
      .get('/articles/by-username/:username', publicController.getArticlesByUsername.bind(publicController), {
        params: t.Object({ username: t.String() }),
        query: t.Object({
          page: t.Optional(t.Numeric({ default: 1 })),
          limit: t.Optional(t.Numeric({ default: 9 })),
          search: t.Optional(t.String()),
          tag: t.Optional(t.String()),
        }),
        detail: { tags: ["Public"], summary: "Get a user's all public articles" }
      })
      .use(rateLimit({ duration: 60 * 1000, max: 3 }))
      .post('/contact/:username', publicController.sendContactMessage.bind(publicController), {
        body: t.Object({
          name: t.String({ minLength: 2 }),
          email: t.String({ format: 'email' }),
          subject: t.String({ minLength: 3 }),
          message: t.String(),
          captchaToken: t.String(),
        }),
        params: t.Object({ username: t.String() }),
        detail: { tags: ["Public"], summary: "Send a contact message to a user" }
      })
  )
}
