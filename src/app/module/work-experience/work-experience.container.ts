import { container } from 'tsyringe'
import { WorkExperienceRepository } from '@module/work-experience/repository/work-experience.repository'
import { WorkExperienceRepositoryImpl } from '@module/work-experience/repository/work-experience.repository.impl'
import { WorkExperienceService } from '@module/work-experience/service/work-experience.service'
import { WorkExperienceServiceImpl } from '@module/work-experience/service/work-experience.service.impl'
import { WorkExperienceController } from '@module/work-experience/controller/work-experience.controller'
import { WorkExperienceControllerImpl } from '@module/work-experience/controller/work-experience.controller.impl'

export async function registerWorkExperienceModule() {
  container.register<WorkExperienceRepository>("WorkExperienceRepository", { useClass: WorkExperienceRepositoryImpl })
  container.register<WorkExperienceService>("WorkExperienceService", { useClass: WorkExperienceServiceImpl })
  container.register<WorkExperienceController>("WorkExperienceController", { useClass: WorkExperienceControllerImpl })
}
