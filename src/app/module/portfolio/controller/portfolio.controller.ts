import { Context } from 'elysia'
import { AppResponse, PageResponse } from '@shared/type/global'
import { PortfolioResponse } from '@module/portfolio/dto/portfolio.dto'

export interface PortfolioController {
  get(ctx: Context): Promise<PageResponse<PortfolioResponse>>
  getById(ctx: Context): Promise<AppResponse>
  post(ctx: Context): Promise<AppResponse>
  patch(ctx: Context): Promise<AppResponse>
  delete(ctx: Context): Promise<AppResponse>
}
