import { Course, NewCourse } from '@module/course/entity/course'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface CourseRepository {
  save(data: NewCourse): Promise<Course>;
  findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Course>>
  findById(id: string): Promise<Course | null>;
}
