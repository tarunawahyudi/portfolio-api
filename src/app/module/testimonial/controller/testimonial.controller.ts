import { Context } from 'elysia'
import { TestimonialResponse } from '@module/testimonial/dto/testimonial.dto'
import { AppResponse, PaginatedResponse } from '@shared/type/global'

export interface TestimonialController {
  get(ctx: Context): Promise<PaginatedResponse<TestimonialResponse>>;
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>;
}
