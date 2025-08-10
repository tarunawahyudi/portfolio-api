import fs from "fs"
import path from "path"
import chalk from "chalk"

export type LogLevel = "error" | "info" | "debug"

interface LoggerOptions {
  level: LogLevel
  logDir: string
}

const levels: LogLevel[] = ["error", "info", "debug"]

const levelColors = {
  error: chalk.red,
  info: chalk.blue,
  debug: chalk.gray,
}

export class Logger {
  private readonly level: LogLevel
  private readonly logDir: string

  constructor(options: LoggerOptions) {
    this.level = options.level
    this.logDir = options.logDir

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return levels.indexOf(level) <= levels.indexOf(this.level)
  }

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private getLogFilePath(): string {
    const date = new Date()
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return path.join(this.logDir, `${y}${m}${d}.log`)
  }

  private writeToFile(message: string) {
    const filePath = this.getLogFilePath()
    fs.appendFileSync(filePath, message + "\n")
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.getTimestamp()
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`
  }

  log(level: LogLevel, message: string) {
    const formattedMessage = this.formatMessage(level, message)

    if (this.shouldLog(level)) {
      const colorFn = levelColors[level] || ((text: string) => text)
      console.log(colorFn(formattedMessage))
    }

    this.writeToFile(formattedMessage)
  }

  info(message: string) {
    this.log("info", message)
  }

  error(message: string) {
    this.log("error", message)
  }

  debug(message: string) {
    this.log("debug", message)
  }
}
