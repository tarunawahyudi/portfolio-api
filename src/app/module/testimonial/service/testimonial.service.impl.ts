import { TestimonialService } from '@module/testimonial/service/testimonial.service'
import { CreateTestimonialRequest, TestimonialResponse } from '@module/testimonial/dto/testimonial.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { TestimonialRepository } from '@module/testimonial/repository/testimonial.repository'
import { NewTestimonial } from '@module/testimonial/entity/testimonial'
import { toTestimonialResponse } from '@module/testimonial/mapper/testimonial.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class TestimonialServiceImpl implements TestimonialService {
  constructor(
    @inject('TestimonialRepository') private readonly testimonialRepository: TestimonialRepository
  ) {}
  async create(request: CreateTestimonialRequest): Promise<TestimonialResponse> {
    const result = await this.testimonialRepository.save(request as NewTestimonial)
    return toTestimonialResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<TestimonialResponse>> {
    const paginatedResult = await this.testimonialRepository.findAll(userId, options)
    const transformedData = paginatedResult.data.map(toTestimonialResponse)

    return {
      data: transformedData,
      pagination: paginatedResult.pagination
    }
  }

  async show(id: string): Promise<TestimonialResponse> {
    const row = await this.testimonialRepository.findById(id)
    if (!row) throw new AppException('TESTIMONIAL-001')
    return toTestimonialResponse(row)

  }

}
