import { Course } from '@module/course/entity/course'
import { CourseResponse } from '@module/course/dto/course.dto'

export function toCourseResponse(course: Course): CourseResponse {
  return {
    id: course.id,
    institution: course.institution,
    courseName: course.courseName,
    startDate: course.startDate,
    endDate: course.endDate ?? null,
    description: course.description ?? '',
  }
}
