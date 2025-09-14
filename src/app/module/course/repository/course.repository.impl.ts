import { CourseRepository } from '@module/course/repository/course.repository'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'
import { Course, NewCourse } from '@module/course/entity/course'
import { eq } from 'drizzle-orm'
import { courses } from '@db/schema'
import { paginate } from '@shared/util/pagination.util'
import { db } from '@db/index'
import { injectable } from 'tsyringe'

@injectable()
export class CourseRepositoryImpl implements CourseRepository {
  async findAll(userId: string, options: PaginationOptions): Promise<PaginatedResponse<Course>> {
    const whereCondition = eq(courses.userId, userId)
    return paginate(db, courses, options, [], whereCondition)
  }

  async findById(id: string): Promise<Course | null> {
    const row = await db.query.courses.findFirst({
      where: eq(courses.id, id)
    })

    return row ?? null
  }

  async save(data: NewCourse): Promise<Course> {
    const [inserted] = await db
      .insert(courses)
      .values(data)
      .returning()

    return inserted
  }

}
