import { Elysia, t } from 'elysia'
import { container } from 'tsyringe'
import { ROOT } from '@shared/constant/commons.constant'
import { authGuard } from '@core/middleware/auth.middleware'
import { TestimonialControllerImpl } from '@module/testimonial/controller/testimonial.controller.impl'

export function registerTestimonialRoutes(app: Elysia) {
  const testimonialController = container.resolve(TestimonialControllerImpl)

  return app.group("/testimonial", (group) =>
    group
      .get(ROOT, testimonialController.get.bind(testimonialController), {
          beforeHandle: authGuard as any,
          query: t.Object({
            page: t.Optional(t.Number({ default: 1, minimum: 1 })),
            limit: t.Optional(t.Number({ default: 10, minimum: 1, maximum: 100 })),
            sort: t.Optional(t.String()),
            search: t.Optional(t.String()),
          }),
          detail: {
            tags: ["Testimonial"],
            summary: "Get list testimonial of users"
          }
        }
      )
      .post(ROOT, testimonialController.post.bind(testimonialController), {
        beforeHandle: authGuard,
        body: t.Object({
          userId: t.String(),
          message: t.String(),
        }),
        detail: {
          tags: ["Testimonial"],
          summary: "Create a new testimonial"
        }
      })
      .get('/:id', testimonialController.getById.bind(testimonialController), {
        beforeHandle: authGuard,
        params: t.Object({ id: t.String() }),
        detail: {
          tags: ["Testimonial"],
          summary: "Get a specific testimonial"
        }
      })
  )
}
