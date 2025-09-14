import { CourseResponse, CreateCourseRequest } from '@module/course/dto/course.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CourseService {
  create(request: CreateCourseRequest): Promise<CourseResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CourseResponse>>
  show(id: string): Promise<CourseResponse>
}
