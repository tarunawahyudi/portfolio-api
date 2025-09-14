import { TestimonialController } from '@module/testimonial/controller/testimonial.controller'
import { Context } from 'elysia'
import { AppResponse, PaginatedResponse } from '@shared/type/global'
import {
  CreateTestimonialRequest,
  TestimonialResponse,
} from '@module/testimonial/dto/testimonial.dto'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { TestimonialService } from '@module/testimonial/service/testimonial.service'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class TestimonialControllerImpl implements TestimonialController {
  constructor(
    @inject('TestimonialService') private readonly testimonialService: TestimonialService
  ) {}
  async get(ctx: Context): Promise<PaginatedResponse<TestimonialResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.testimonialService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.testimonialService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const author = (ctx as any).user?.sub
    if (!author) throw new AppException('AUTH-001')

    const request = (ctx.body as any) as CreateTestimonialRequest
    request.author = author
    const response = await this.testimonialService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

}
