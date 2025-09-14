import { container } from 'tsyringe'
import { SettingRepository } from '@module/setting/repository/setting.repository'
import { SettingService } from '@module/setting/service/setting.service'
import { SettingController } from '@module/setting/controller/setting.controller'
import { SettingRepositoryImpl } from '@module/setting/repository/setting.repository.impl'
import { SettingServiceImpl } from '@module/setting/service/setting.service.impl'
import { SettingControllerImpl } from '@module/setting/controller/setting.controller.impl'

export async function registerSettingModule() {
  container.register<SettingRepository>("SettingRepository", { useClass: SettingRepositoryImpl })
  container.register<SettingService>("SettingService", { useClass: SettingServiceImpl })
  container.register<SettingController>("SettingController", { useClass: SettingControllerImpl })
}
