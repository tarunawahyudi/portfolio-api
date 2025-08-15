import type { Context } from "elysia"

export function successResponse(
  ctx: Context,
  data: any,
  message = "Success",
  status = 200
) {
  ctx.set.status = status
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}
