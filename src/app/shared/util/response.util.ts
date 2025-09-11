import type { Context } from 'elysia'
import { AppResponse, PageResponse, PaginatedResponse } from '@shared/type/global'

export function successResponse(
  ctx: Context,
  data: any,
  message = 'Success',
  status = 200,
): AppResponse {
  ctx.set.status = status
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

export function noResponse(ctx: Context, message = 'Success', status = 200) {
  ctx.set.status = status
  return {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  }
}

export function paginateResponse(
  ctx: any,
  data: any,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: object,
) {
  ctx.set.status = statusCode
  const response: any = {
    code: statusCode,
    status: 'success',
    message: message,
    data: data,
  }
  if (pagination) {
    response.pagination = pagination
  }
  return response
}

export function pageResponse<T>(
  ctx: Context,
  paginatedData: PaginatedResponse<T>,
  message = 'Success',
  status = 200,
): PageResponse<T> {
  ctx.set.status = status
  return {
    success: true,
    message,
    data: paginatedData.data,
    pagination: paginatedData.pagination,
    timestamp: new Date().toISOString(),
  }
}
