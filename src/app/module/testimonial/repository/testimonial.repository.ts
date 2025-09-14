import { NewTestimonial, Testimonial } from '@module/testimonial/entity/testimonial'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface TestimonialRepository {
  save(data: NewTestimonial): Promise<Testimonial>
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Testimonial>>
  findById(id: string): Promise<Testimonial | null>
}
