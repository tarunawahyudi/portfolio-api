import {
  CourseResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@module/course/dto/course.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CourseService {
  create(request: CreateCourseRequest): Promise<CourseResponse>
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<CourseResponse>>
  show(id: string, userId: string): Promise<CourseResponse>
  modify(id: string, userId: string, data: UpdateCourseRequest): Promise<CourseResponse>
  remove(id: string, userId: string): Promise<void>
}
