import {
  CreateTestimonialRequest,
  TestimonialResponse,
} from '@module/testimonial/dto/testimonial.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface TestimonialService {
  create(request: CreateTestimonialRequest): Promise<TestimonialResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<TestimonialResponse>>
  show(id: string): Promise<TestimonialResponse>
}
