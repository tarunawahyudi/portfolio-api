import { container } from 'tsyringe'
import { TestimonialRepository } from '@module/testimonial/repository/testimonial.repository'
import { TestimonialRepositoryImpl } from '@module/testimonial/repository/testimonial.repository.impl'
import { TestimonialServiceImpl } from '@module/testimonial/service/testimonial.service.impl'
import { TestimonialService } from '@module/testimonial/service/testimonial.service'
import { TestimonialController } from '@module/testimonial/controller/testimonial.controller'
import { TestimonialControllerImpl } from '@module/testimonial/controller/testimonial.controller.impl'

export async function registerTestimonialModule() {
  container.register<TestimonialRepository>("TestimonialRepository", { useClass: TestimonialRepositoryImpl })
  container.register<TestimonialService>("TestimonialService", { useClass: TestimonialServiceImpl })
  container.register<TestimonialController>("TestimonialController", { useClass: TestimonialControllerImpl })
}
