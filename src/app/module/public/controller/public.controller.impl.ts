import { injectable, inject } from 'tsyringe'
import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { noResponse, paginateResponse, successResponse } from '@shared/util/response.util'
import { PublicController } from '@module/public/controller/public.controller'
import type { PublicService } from '@module/public/service/public.service'
import { parsePaginationOptions } from '@shared/util/pagination.util'
import { PublicCertificateItemDto } from '@module/public/dto/public.dto'

@injectable()
export class PublicControllerImpl implements PublicController {
  constructor(@inject('PublicService') private readonly publicService: PublicService) {}

  async getByUsername(ctx: Context): Promise<AppResponse> {
    const { username } = ctx.params
    const data = await this.publicService.getPublicProfile(username)
    return successResponse(ctx, data)
  }

  async downloadCv(ctx: Context): Promise<Buffer> {
    const { username } = ctx.params
    const pdfBuffer = await this.publicService.generateCvAsPdf(username)

    ctx.set.headers['Content-Type'] = 'application/pdf'
    ctx.set.headers['Content-Disposition'] = `attachment; filename="cv-${username}.pdf"`

    return pdfBuffer
  }

  async getPortfolioById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const data = await this.publicService.getPublicPortfolioDetail(id)
    return successResponse(ctx, data)
  }

  async getArticleBySlug(ctx: Context): Promise<AppResponse> {
    const { slug } = ctx.params
    const data = await this.publicService.getPublicArticleBySlug(slug)
    return successResponse(ctx, data)
  }

  async sendContactMessage(ctx: Context): Promise<AppResponse> {
    const { username } = ctx.params
    const formData = ctx.body as {
      name: string
      email: string
      subject: string
      message: string
      captchaToken: string
    }
    const clientIp =
      ctx.request.headers.get('CF-Connecting-IP') ??
      ctx.request.headers.get('x-forwarded-for') ??
      undefined

    await this.publicService.sendContactEmail({ username, formData, clientIp })
    return noResponse(ctx, 'Message sent successfully')
  }

  async getPortfoliosByUsername(ctx: Context): Promise<PageResponse<any>> {
    const { username } = ctx.params
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.publicService.getPublicPortfolios(username, options)
    return paginateResponse(ctx, paginatedData)
  }

  async getCertificatesByUsername(ctx: Context): Promise<PageResponse<PublicCertificateItemDto>> {
    const { username } = ctx.params
    const options = parsePaginationOptions(ctx.query)
    const paginatedData = await this.publicService.getPublicCertificates(username, options)
    return paginateResponse(ctx, paginatedData)
  }

  async getCertificateById(ctx: Context): Promise<AppResponse> {
    const { id } = ctx.params
    const data = await this.publicService.getPublicCertificateDetail(id)
    return successResponse(ctx, data)
  }
}
