import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import config from '@core/config'

const logDirectory = path.resolve(process.cwd(), config.logger.path)
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true })
}

function getDailyLogFilePath(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return path.join(logDirectory, `app-${year}${month}${day}.log`)
}

function formatConsoleLog(level: string, message: string): string {
  const time = chalk.gray(new Date().toISOString())
  const levelColor =
    level === 'error'
      ? chalk.red.bold
      : level === 'warn'
        ? chalk.yellow.bold
        : level === 'debug'
          ? chalk.magenta.bold
          : chalk.cyan.bold

  return `[${time}][${levelColor(level.toUpperCase())}] ${message}`
}

function formatFileLog(level: string, message: string): string {
  const time = new Date().toISOString()
  return `[${time}][${level.toUpperCase()}] ${message}`
}


const levelPriority: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
}
const minLevel = config.logger.level || 'info'

function writeToFile(text: string) {
  const logFilePath = getDailyLogFilePath()
  fs.appendFileSync(logFilePath, text + '\n', { encoding: 'utf-8' })
}

export const logger = {
  log: (level: keyof typeof levelPriority, message: string) => {
    if (levelPriority[level] <= levelPriority[minLevel]) {
      const consoleFormatted = formatConsoleLog(level, message)
      const fileFormatted = formatFileLog(level, message)

      console.log(consoleFormatted)
      writeToFile(fileFormatted)
    }
  },
  info: (message: string) => {
    logger.log('info', message)
  },
  warn: (message: string) => {
    logger.log('warn', message)
  },
  error: (message: string) => {
    logger.log('error', message)
  },
  debug: (message: string) => {
    logger.log('debug', message)
  }
}
