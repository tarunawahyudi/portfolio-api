import {readFileSync} from "fs"
import config from "./index"
import {COLORS} from "@shared/constant/colors.constant"

export function startupConfig() {
  try {
    const banner = readFileSync(config.resources.banner, "utf-8")
    console.log(`${banner}${COLORS.RESET}`)
  } catch {
    console.log(`${COLORS.YELLOW}Banner file not found. Skipping banner...${COLORS.RESET}`)
  }

  const now = new Date().toLocaleString("id-ID")

  const entries = [
    {icon: "🚀 ", key: "Service", value: config.app.name, color: COLORS.CYAN},
    {icon: "💻 ", key: "Tech Stack", value: "Elysia", color: COLORS.MAGENTA},
    {icon: "🕒 ", key: "Started At", value: now, color: COLORS.YELLOW},
    {icon: "🌐 ", key: "Listening", value: `${config.app.baseUrl}`, color: COLORS.BLUE},
    {icon: "📚 ", key: "Swagger UI", value: `${config.app.baseUrl}${config.swagger.path}`, color: COLORS.MAGENTA},
    {
      icon: "🏠 ",
      key: "Mode",
      value: config.app.environment === "dev" ? "Development" : "Production",
      color: COLORS.GREEN
    },
  ]

  const keyWidth = 12
  const BOLD = "\x1b[1m"
  const RESET = COLORS.RESET

  for (const entry of entries) {
    const paddedKey = `${entry.key}`.padEnd(keyWidth)
    console.log(`${entry.icon} ${entry.color}${paddedKey}${RESET} : ${BOLD}${entry.value}${RESET}`)
  }

  console.log()
}
