import { container } from 'tsyringe'
import { CourseRepository } from '@module/course/repository/course.repository'
import { CourseService } from '@module/course/service/course.service'
import { CourseController } from '@module/course/controller/course.controller'
import { CourseRepositoryImpl } from '@module/course/repository/course.repository.impl'
import { CourseServiceImpl } from '@module/course/service/course.service.impl'
import { CourseControllerImpl } from '@module/course/controller/course.controller.impl'

export async function registerCourseModule() {
  container.register<CourseRepository>("CourseRepository", { useClass: CourseRepositoryImpl })
  container.register<CourseService>("CourseService", { useClass: CourseServiceImpl })
  container.register<CourseController>("CourseController", { useClass: CourseControllerImpl })
}
