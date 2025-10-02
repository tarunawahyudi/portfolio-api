import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { CertificateControllerImpl } from '@module/certificate/controller/certificate.controller.impl'

export function registerCertificateRoutes(app: Elysia) {
  const certificateController = container.resolve(CertificateControllerImpl)

  const displaySchema = t.Object({
    type: t.Union([t.Literal('icon'), t.Literal('upload'), t.Literal('default')]),
    value: t.String(),
    backgroundColor: t.Optional(t.String()),
    color: t.Optional(t.String()),
  })

  const certificateBodyBase = {
    title: t.String({ minLength: 3 }),
    organization: t.Optional(t.String()),
    issueDate: t.Optional(t.String({ format: 'date' })),
    expirationDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
    credentialId: t.Optional(t.String()),
    credentialUrl: t.Optional(t.String()),
    description: t.Optional(t.String()),
    isFeatured: t.Optional(t.Boolean()),
    display: t.Optional(displaySchema),
  }

  return app.group('/certificates', (group) =>
    group
      .get(ROOT, certificateController.get.bind(certificateController), {
        beforeHandle: authGuard as any,
        query: t.Object({
          page: t.Optional(t.Number({ min: 1 })),
          limit: t.Optional(t.Number({ min: 1, max: 100 })),
        }),
        detail: { tags: ['Certificate'], summary: "Get list of user's certificates" },
      })
      .post(ROOT, certificateController.post.bind(certificateController), {
        beforeHandle: authGuard,
        body: t.Object(certificateBodyBase),
        detail: { tags: ['Certificate'], summary: 'Create a new certificate' },
      })
      .get('/:id', certificateController.getById.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Certificate'], summary: 'Get a certificate by ID' },
      })
      .patch('/:id', certificateController.patch.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({
          ...Object.fromEntries(
            Object.entries(certificateBodyBase).map(([k, v]) => [k, t.Optional(v)]),
          ),
        }),
        detail: { tags: ['Certificate'], summary: 'Update a certificate' },
      })
      .delete('/:id', certificateController.delete.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: { tags: ['Certificate'], summary: 'Delete a certificate' },
      })
      .post(
        '/:id/certificate-image',
        certificateController.uploadCertificateImage.bind(certificateController),
        {
          beforeHandle: authGuard,
          params: t.Object({ id: t.String({ format: 'uuid' }) }),
          body: t.Object({
            image: t.File({ type: ['image/jpeg', 'image/png', 'image/webp'], maxSize: '5m' }),
          }),
          detail: { tags: ['Certificate'], summary: 'Upload main certificate image' },
        },
      )
      .post('/:id/display-image', certificateController.uploadDisplay.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        body: t.Object({
          image: t.File({ type: ['image/jpeg', 'image/png', 'image/webp'], maxSize: '2m' }),
        }),
        detail: { tags: ['Certificate'], summary: 'Upload display/logo image' },
      }),
  )
}
