import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { CertificateControllerImpl } from '@module/certificate/controller/certificate.controller.impl'

export function registerCertificateRoutes(app: Elysia) {
  const certificateController = container.resolve(CertificateControllerImpl)

  return app.group("/certificate", (group) =>
    group
      .get(ROOT, certificateController.get.bind(certificateController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Certificate"],
            summary: "Get list certificate of users"
          }
        }
      )
      .post(ROOT, certificateController.post.bind(certificateController), {
        beforeHandle: authGuard,
        body: t.Object({
          title: t.String(),
          organization: t.Optional(t.String()),
          issueDate: t.Optional(t.String({ format: 'date' })),
          expirationDate: t.Optional(t.String({ format: 'date' })),
          credentialId: t.Optional(t.String()),
          credentialUrl: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Certificate"],
          summary: "Create a certificate of user"
        }
      })
      .get('/:id', certificateController.getById.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String({ format: 'uuid' }) }),
        detail: {
          tags: ["Certificate"],
          summary: "Get detail certificate of user"
        }
      })
      .post('/:id/upload', certificateController.upload.bind(certificateController), {
        beforeHandle: authGuard,
        params: t.Object({
          id: t.String({ format: 'uuid' })
        }),
        body: t.Object({
          image: t.File({
            type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            maxSize: '5m'
          })
        }),
        detail: {
          tags: ["Certificate"],
          summary: "Upload certificate image"
        }
      })
  )
}
