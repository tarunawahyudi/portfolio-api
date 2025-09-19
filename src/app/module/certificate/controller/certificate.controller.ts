import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { CertificateResponse } from '@module/certificate/dto/certificate.dto'

export interface CertificateController {
  get(ctx: Context): Promise<PageResponse<CertificateResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  patch(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
  uploadCertificateImage(ctx: Context): Promise<AppResponse>
  uploadDisplay(ctx: Context): Promise<AppResponse>
}
