import { container } from 'tsyringe'
import { EducationRepository } from '@module/education/repository/education.repository'
import { EducationRepositoryImpl } from '@module/education/repository/education.repository.impl'
import { EducationService } from '@module/education/service/education.service'
import { EducationServiceImpl } from '@module/education/service/education.service.impl'
import { EducationController } from '@module/education/controller/education.controller'
import { EducationControllerImpl } from '@module/education/controller/education.controller.impl'

export async function registerEducationModule() {
  container.register<EducationRepository>("EducationRepository", { useClass: EducationRepositoryImpl })
  container.register<EducationService>("EducationService", { useClass: EducationServiceImpl })
  container.register<EducationController>("EducationController", { useClass: EducationControllerImpl })
}
