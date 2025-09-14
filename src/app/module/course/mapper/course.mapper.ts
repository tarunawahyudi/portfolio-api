import { Course } from '@module/course/entity/course'
import { CourseResponse } from '@module/course/dto/course.dto'

export function toCourseResponse(course: Course): CourseResponse {
  return {
    institution: course.institution,
    courseName: course.courseName,
    startDate: course.startDate,
    endDate: course.endDate ?? '',
    description: course.description ?? '',
  }
}
