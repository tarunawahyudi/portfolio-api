import { Testimonial } from '@module/testimonial/entity/testimonial'
import { TestimonialResponse } from '@module/testimonial/dto/testimonial.dto'

export function toTestimonialResponse(testimonial: Testimonial): TestimonialResponse {
  return {
    author: testimonial.author,
    message: testimonial.message,
  }
}
