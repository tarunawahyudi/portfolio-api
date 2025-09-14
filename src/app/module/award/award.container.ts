import { container } from 'tsyringe'
import { AwardRepository } from '@module/award/repository/award.repository'
import { AwardRepositoryImpl } from '@module/award/repository/award.repository.impl'
import { AwardService } from '@module/award/service/award.service'
import { AwardServiceImpl } from '@module/award/service/award.service.impl'
import { AwardControllerImpl } from '@module/award/controller/award.controller.impl'
import { AwardController } from '@module/award/controller/award.controller'

export async function registerAwardModule() {
  container.register<AwardRepository>("AwardRepository", { useClass: AwardRepositoryImpl })
  container.register<AwardService>("AwardService", { useClass: AwardServiceImpl })
  container.register<AwardController>("AwardController", { useClass: AwardControllerImpl })
}
