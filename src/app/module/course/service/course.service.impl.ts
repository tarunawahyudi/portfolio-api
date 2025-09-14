import { CourseService } from '@module/course/service/course.service'
import { CourseResponse, CreateCourseRequest } from '@module/course/dto/course.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { inject, injectable } from 'tsyringe'
import type { CourseRepository } from '@module/course/repository/course.repository'
import { NewCourse } from '@module/course/entity/course'
import { toCourseResponse } from '@module/course/mapper/course.mapper'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CourseServiceImpl implements CourseService {
  constructor(
    @inject('CourseRepository') private readonly courseRepository: CourseRepository
  ) {}
  async create(request: CreateCourseRequest): Promise<CourseResponse> {
    const result = await this.courseRepository.save(request as NewCourse)
    return toCourseResponse(result)
  }

  async fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CourseResponse>> {
    const paginatedResult = await this.courseRepository.findAll(userId, options)
    const transformData = paginatedResult.data.map(toCourseResponse)

    return {
      data: transformData,
      pagination: paginatedResult.pagination
    }
  }

  async show(id: string): Promise<CourseResponse> {
    const row = await this.courseRepository.findById(id)
    if (!row) throw new AppException('COURSE-001')
    return toCourseResponse(row)
  }

}
