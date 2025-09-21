import { container } from 'tsyringe'
import { PublicService } from '@module/public/service/public.service'
import { PublicServiceImpl } from '@module/public/service/public.service.impl'
import { PublicControllerImpl } from '@module/public/controller/public.controller.impl'
import { PublicController } from '@module/public/controller/public.controller'

export async function registerPublicModule() {
  container.register<PublicService>("PublicService", { useClass: PublicServiceImpl })
  container.register<PublicController>("PublicController", { useClass: PublicControllerImpl })
}
