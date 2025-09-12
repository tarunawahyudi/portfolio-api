import { successResponse } from '@shared/util/response.util'
import { inject, injectable } from 'tsyringe'
import { MediaController } from '@module/media/controller/media.controller'
import type { MediaService } from '@module/media/service/media.service'
import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

@injectable()
export class MediaControllerImpl implements MediaController {
  constructor(@inject('MediaService') private readonly mediaService: MediaService) {}

  async remove(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const { id: mediaId } = ctx.params
    const response = await this.mediaService.remove(mediaId, userId)
    return successResponse(ctx, response)
  }
}
