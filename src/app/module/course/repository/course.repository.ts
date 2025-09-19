import { Course, NewCourse } from '@module/course/entity/course'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { UpdateCourseRequest } from '@module/course/dto/course.dto'

export interface CourseRepository {
  save(data: NewCourse): Promise<Course>;
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Course>>
  findByIdAndUser(id: string, userId: string): Promise<Course | null>
  update(id: string, userId: string, data: UpdateCourseRequest): Promise<Course>
  delete(id: string, userId: string): Promise<void>
}
