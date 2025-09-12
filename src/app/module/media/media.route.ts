import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { MediaControllerImpl } from './controller/media.controller.impl'
import { authGuard } from '@core/middleware/auth.middleware'

const mediaController = container.resolve(MediaControllerImpl)

export const registerMediaRoutes = new Elysia({ prefix: '/media' })
  .use(authGuard as any)
  .delete('/:id', mediaController.remove.bind(mediaController), {
    params: t.Object({
      id: t.String({ format: 'uuid' })
    }),
    detail: {
      tags: ['Media'],
      summary: 'Delete a media item'
    },
  })
