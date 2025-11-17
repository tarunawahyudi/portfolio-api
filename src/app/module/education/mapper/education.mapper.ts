import { Education } from '@module/education/entity/education'
import { EducationResponse } from '@module/education/dto/education.dto'
import { getYearFromDate } from '@shared/util/common.util'

export function toEducationResponse(edu: Education): EducationResponse {
  return {
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree ?? '',
    fieldOfStudy: edu.fieldOfStudy ?? '',
    grade: edu.grade ?? undefined,
    startDate: getYearFromDate(edu.startDate),
    endDate: getYearFromDate(edu.endDate) ?? undefined,
    description: edu.description ?? undefined,
  }
}
