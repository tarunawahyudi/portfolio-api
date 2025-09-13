import { container } from 'tsyringe'
import { SkillRepository } from '@module/skill/repository/skill.repository'
import { SkillRepositoryImpl } from '@module/skill/repository/skill.repository.impl'
import { SkillServiceImpl } from '@module/skill/service/skill.service.impl'
import { SkillService } from '@module/skill/service/skill.service'
import { SkillController } from '@module/skill/controller/skill.controller'
import { SkillControllerImpl } from '@module/skill/controller/skill.controller.impl'

export async function registerSkillModule() {
  container.register<SkillRepository>("SkillRepository", { useClass: SkillRepositoryImpl })
  container.register<SkillService>("SkillService", { useClass: SkillServiceImpl })
  container.register<SkillController>("SkillController", { useClass: SkillControllerImpl })
}
