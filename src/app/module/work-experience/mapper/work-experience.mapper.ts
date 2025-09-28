import { WorkExperience } from '@module/work-experience/entity/work-experience'
import { WorkExperienceResponse } from '@module/work-experience/dto/work-experience.dto'

export function toWorkExperienceResponse(workExperience: WorkExperience): WorkExperienceResponse {
  return {
    id: workExperience.id,
    userId: workExperience.userId,
    company: workExperience.company,
    position: workExperience.position,
    startDate: workExperience.startDate,
    endDate: workExperience.endDate ?? '',
    isCurrent: workExperience.isCurrent ?? false,
    jobDesk: workExperience.jobDesk ?? [],
  }
}
