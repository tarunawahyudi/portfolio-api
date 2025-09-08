export interface AppResponse {
  success: boolean
  message: string
  data: Record<string, unknown>
  timestamp: string
}
