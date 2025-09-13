import { CertificateController } from '@module/certificate/controller/certificate.controller'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import {
  CertificateResponse,
  CreateCertificateRequest,
} from '@module/certificate/dto/certificate.dto'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { inject, injectable } from 'tsyringe'
import type { CertificateService } from '@module/certificate/service/certificate.service'
import { paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CertificateControllerImpl implements CertificateController {
  constructor(@inject('CertificateService') private certificateService: CertificateService) {}

  async get(ctx: Context): Promise<PageResponse<CertificateResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.certificateService.fetch(userId, options)
    return paginateResponse(ctx, paginatedData, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const id = ctx.params.id
    const response = await this.certificateService.show(id)
    return successResponse(ctx, response)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const request = ctx.body as any as CreateCertificateRequest
    request.userId = userId
    const response = await this.certificateService.create(request)
    return successResponse(ctx, response, 'create success', 201)
  }

  async upload(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    if (!userId) throw new AppException('AUTH-000')

    const id = ctx.params.id
    const { image } = ctx.body as { image: File }
    if (!image || image.size === 0) {
      throw new AppException('MEDIA-001', 'No file uploaded or file is empty.')
    }

    const response = await this.certificateService.uploadCertificateImage(id, image)
    return successResponse(ctx, response, 'upload success')
  }
}
