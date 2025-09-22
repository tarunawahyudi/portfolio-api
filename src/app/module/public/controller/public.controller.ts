import { AppResponse } from '@shared/type/global'
import { Context } from 'elysia'

export interface PublicController {
  getByUsername(ctx: Context): Promise<AppResponse>
  downloadCv(ctx: Context): Promise<Buffer>
  getPortfolioById(ctx: Context): Promise<AppResponse>
}
