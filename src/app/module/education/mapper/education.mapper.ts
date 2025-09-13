import { Education } from '@module/education/entity/education'
import { EducationResponse } from '@module/education/dto/education.dto'

export function toEducationResponse(education: Education): EducationResponse {
  return {
    id: education.id,
    institution: education.institution,
    degree: education.degree ?? '',
    fieldOfStudy: education.fieldOfStudy ?? '',
    grade: education.grade ?? '',
    startDate: education.startDate,
    endDate: education.endDate ?? '',
    description: education.description ?? '',
  }
}
