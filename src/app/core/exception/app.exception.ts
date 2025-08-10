import {findErrorByCode} from "@core/exception/error-catalog"
import {randomUUIDv7} from "bun"

export class AppException extends Error {
  public readonly code: string
  public readonly module: string
  public readonly httpStatus: number
  public readonly ticketCode: string

  constructor(code: string, customMessage?: string) {
    const error = findErrorByCode(code)
    if (!error) {
      super(customMessage ?? "Unknown error")
      this.code = code
      this.module = "UNKNOWN"
      this.httpStatus = 500
      this.ticketCode = generateTicketCode()
      return
    }

    super(customMessage ?? error.message)

    this.code = error.code
    this.module = error.module
    this.httpStatus = error.httpStatus
    this.ticketCode = generateTicketCode()
  }
}

function generateTicketCode() {
  return randomUUIDv7().toUpperCase()
}
