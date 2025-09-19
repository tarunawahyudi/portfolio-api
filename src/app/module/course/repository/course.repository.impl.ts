import { injectable } from 'tsyringe'
import { and, eq } from 'drizzle-orm'
import { db } from '@db/index'
import { courses } from '@db/schema'
import { Course, NewCourse } from '@module/course/entity/course'
import { UpdateCourseRequest } from '@module/course/dto/course.dto'
import { CourseRepository } from '@module/course/repository/course.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { paginate } from '@shared/util/pagination.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CourseRepositoryImpl implements CourseRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Course>> {
    const whereCondition = eq(courses.userId, userId)
    return paginate(db, courses, options, [courses.courseName, courses.institution], whereCondition)
  }

  async findByIdAndUser(id: string, userId: string): Promise<Course | null> {
    const row = await db.query.courses.findFirst({
      where: and(eq(courses.id, id), eq(courses.userId, userId)),
    })
    return row ?? null
  }

  async save(data: NewCourse): Promise<Course> {
    const [inserted] = await db.insert(courses).values(data).returning()
    return inserted
  }

  async update(id: string, userId: string, data: UpdateCourseRequest): Promise<Course> {
    const [updated] = await db
      .update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning()
    if (!updated) throw new AppException('COURSE-001', 'Course not found or access denied.')
    return updated
  }

  async delete(id: string, userId: string): Promise<void> {
    await db.delete(courses).where(and(eq(courses.id, id), eq(courses.userId, userId)))
  }
}
