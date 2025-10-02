import { AppResponse, PageResponse } from '@shared/type/global'
import { Context } from 'elysia'
import { PublicCertificateItemDto } from '@module/public/dto/public.dto'

export interface PublicController {
  getByUsername(ctx: Context): Promise<AppResponse>
  downloadCv(ctx: Context): Promise<Buffer>
  getPortfolioById(ctx: Context): Promise<AppResponse>
  getArticleBySlug(ctx: Context): Promise<AppResponse>
  getPortfoliosByUsername(ctx: Context): Promise<PageResponse<any>>
  sendContactMessage(ctx: Context): Promise<AppResponse>
  getCertificatesByUsername(ctx: Context): Promise<PageResponse<PublicCertificateItemDto>>
  getCertificateById(ctx: Context): Promise<AppResponse>
}
