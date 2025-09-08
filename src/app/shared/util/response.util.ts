import type { Context } from "elysia"
import { AppResponse } from '@shared/type/global'

export function successResponse(
  ctx: Context,
  data: any,
  message = "Success",
  status = 200
): AppResponse {
  ctx.set.status = status
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}
