import { injectable, inject } from 'tsyringe'
import { Context } from 'elysia'
import { CertificateController } from '@module/certificate/controller/certificate.controller'
import type { CertificateService } from '@module/certificate/service/certificate.service'
import {
  CreateCertificateRequest,
  UpdateCertificateRequest,
  CertificateResponse,
} from '@module/certificate/dto/certificate.dto'
import { AppResponse, PageResponse } from '@shared/type/global'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { AppException } from '@core/exception/app.exception'

@injectable()
export class CertificateControllerImpl implements CertificateController {
  constructor(@inject('CertificateService') private certificateService: CertificateService) {}

  async get(ctx: Context): Promise<PageResponse<CertificateResponse>> {
    const userId = (ctx as any).user?.sub
    const options = parsePaginationOptions(ctx.query)
    const data = await this.certificateService.fetch(userId, options)
    return paginateResponse(ctx, data, 'fetch success')
  }

  async getById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const data = await this.certificateService.show(id, userId)
    return successResponse(ctx, data)
  }

  async post(ctx: Context): Promise<AppResponse> {
    const userId = (ctx as any).user?.sub
    const request = ctx.body as CreateCertificateRequest
    request.userId = userId
    const data = await this.certificateService.create(request)
    return successResponse(ctx, data, 'Certificate created successfully', 201)
  }

  async patch(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const request = ctx.body as UpdateCertificateRequest
    const data = await this.certificateService.modify(id, userId, request)
    return successResponse(ctx, data, 'Certificate updated successfully')
  }

  async delete(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    await this.certificateService.remove(id, userId)
    return noResponse(ctx, 'Certificate deleted successfully')
  }

  async uploadCertificateImage(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { image } = ctx.body as { image: File }
    if (!image || image.size === 0) throw new AppException('MEDIA-001')
    const data = await this.certificateService.uploadCertificateImage(id, userId, image)
    return successResponse(ctx, data, 'Certificate image uploaded successfully')
  }

  async uploadDisplay(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const userId = (ctx as any).user?.sub
    const { image } = ctx.body as { image: File }
    if (!image || image.size === 0) throw new AppException('MEDIA-001')
    const data = await this.certificateService.uploadDisplayImage(id, userId, image)
    return successResponse(ctx, data, 'Display image uploaded successfully')
  }
}
