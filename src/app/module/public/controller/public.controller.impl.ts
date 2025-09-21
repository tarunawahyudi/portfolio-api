import { injectable, inject } from 'tsyringe'
import { Context } from 'elysia'
import { AppResponse } from '@shared/type/global'
import { successResponse } from '@shared/util/response.util'
import { PublicController } from '@module/public/controller/public.controller'
import type { PublicService } from '@module/public/service/public.service'

@injectable()
export class PublicControllerImpl implements PublicController {
  constructor(@inject("PublicService") private readonly publicService: PublicService) {}

  async getByUsername(ctx: Context): Promise<AppResponse> {
    const { username } = ctx.params
    const data = await this.publicService.getPublicProfile(username)
    return successResponse(ctx, data)
  }
}
