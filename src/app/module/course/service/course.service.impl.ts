import { injectable, inject } from 'tsyringe'
import { CourseService } from '@module/course/service/course.service'
import type { CourseRepository } from '@module/course/repository/course.repository'
import {
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseResponse,
} from '@module/course/dto/course.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { NewCourse } from '@module/course/entity/course'
import { toCourseResponse } from '@module/course/mapper/course.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CourseServiceImpl implements CourseService {
  constructor(@inject('CourseRepository') private readonly courseRepository: CourseRepository) {}

  private async findAndValidate(id: string, userId: string) {
    const record = await this.courseRepository.findByIdAndUser(id, userId)
    if (!record) {
      throw new AppException('COURSE-001')
    }
    return record
  }

  async fetch(
    userId: string,
    options: PaginationOptions,
  ): Promise<PaginatedResponse<CourseResponse>> {
    const result = await this.courseRepository.findAll(userId, options)
    return { data: result.data.map(toCourseResponse), pagination: result.pagination }
  }

  async show(id: string, userId: string): Promise<CourseResponse> {
    const record = await this.findAndValidate(id, userId)
    return toCourseResponse(record)
  }

  async create(request: CreateCourseRequest): Promise<CourseResponse> {
    const result = await this.courseRepository.save(request as NewCourse)
    return toCourseResponse(result)
  }

  async modify(id: string, userId: string, data: UpdateCourseRequest): Promise<CourseResponse> {
    await this.findAndValidate(id, userId)
    const updated = await this.courseRepository.update(id, userId, data)
    return toCourseResponse(updated)
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findAndValidate(id, userId)
    await this.courseRepository.delete(id, userId)
  }
}
