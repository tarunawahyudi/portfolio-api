import pino from 'pino'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import config from '@core/config'

const logDir = config.logger.path
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })

function getLogFilePath() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return path.join(logDir, `${y}${m}${day}.log`)
}

function formatLog(level: string, message: string) {
  const time = new Date().toISOString()
  const levelColor =
    level === 'error' ? chalk.red :
      level === 'warn' ? chalk.yellow :
        chalk.blue
  return `[${chalk.gray(time)}][${levelColor(level.toUpperCase())}] ${message}`
}

const logFileStream = fs.createWriteStream(getLogFilePath(), { flags: 'a' })

const logger = pino(
  {
    level: config.logger.level,
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level(label) {
        return { level: label }
      }
    }
  },
  logFileStream
)

export const customLogger = {
  info: (msg: string) => {
    console.log(formatLog('info', msg))
    logger.info(msg)
  },
  warn: (msg: string) => {
    console.log(formatLog('warn', msg))
    logger.warn(msg)
  },
  error: (msg: string) => {
    console.log(formatLog('error', msg))
    logger.error(msg)
  },
  debug: (msg: string) => {
    console.log(formatLog('debug', msg))
    logger.debug(msg)
  }
}
