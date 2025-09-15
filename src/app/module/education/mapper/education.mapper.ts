import { Education } from '@module/education/entity/education'
import { EducationResponse } from '@module/education/dto/education.dto'

export function toEducationResponse(edu: Education): EducationResponse {
  return {
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree ?? '',
    fieldOfStudy: edu.fieldOfStudy ?? '',
    grade: edu.grade ?? undefined,
    startDate: edu.startDate,
    endDate: edu.endDate ?? undefined,
    description: edu.description ?? undefined,
  }
}
