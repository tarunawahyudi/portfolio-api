import {
  CreatePortfolioRequest,
  PortfolioResponse,
  UpdatePortfolioRequest,
} from '@module/portfolio/dto/portfolio.dto'
import { PaginatedResponse, PaginationOptions } from '@shared/type/global'

export interface PortfolioService {
  fetch(userId: string, options: PaginationOptions): Promise<PaginatedResponse<PortfolioResponse>>
  create(data: CreatePortfolioRequest): Promise<PortfolioResponse>
  show(id: string): Promise<PortfolioResponse>
  modify(id: string, userId: string, data: UpdatePortfolioRequest): Promise<PortfolioResponse>
  remove(id: string, userId: string): Promise<void>
}
