import fs from "fs"
import path from "path"
import config from "@core/config"

interface ErrorEntry {
  code: string
  module: string
  message: string
  httpStatus: number
}

let errorCatalog: ErrorEntry[] = []

function loadErrorCatalog() {
  if (errorCatalog.length) return errorCatalog

  const csvPath = path.resolve(process.cwd(), config.resources.dictionary.error)
  const content = fs.readFileSync(csvPath, { encoding: "utf8" })
  const lines = content.trim().split("\n")
  const headers = lines.shift()?.split(",") ?? []

  errorCatalog = lines.map(line => {
    const values = line.split(",")
    const entry: Record<string, string> = {}
    headers.forEach((h, i) => (entry[h] = values[i]))
    return {
      code: entry["code"]!,
      module: entry["module"]!,
      message: entry["message"]!,
      httpStatus: parseInt(entry["httpStatus"]!, 10)
    }
  })

  return errorCatalog
}

export function findErrorByCode(code: string): ErrorEntry | undefined {
  const catalog = loadErrorCatalog()
  return catalog.find(e => e.code === code)
}
