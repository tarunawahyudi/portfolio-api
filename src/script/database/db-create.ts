import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_ROOT = path.resolve(__dirname, "../../db")
const PARTS = ["migrations", "patches", "seeds"]

const [part, moduleName] = process.argv.slice(2)

if (!PARTS.includes(part)) {
  console.error(`Part must be one of: ${PARTS.join(", ")}`)
  process.exit(1)
}

if (!moduleName) {
  console.error(`Module name is required.`)
  process.exit(1)
}

const partPath = path.join(DB_ROOT, part, moduleName)
const changelogPath = path.join(DB_ROOT, "changelog", `${part}.yaml`)

if (!fs.existsSync(partPath)) {
  fs.mkdirSync(partPath, { recursive: true })
}

const existingFiles = fs.readdirSync(partPath).filter(f => f.endsWith(".sql"))
const newNumber = (existingFiles.length + 1).toString().padStart(3, "0")

const fileName = `${newNumber}_${moduleName}.sql`
const rollbackFileName = `${newNumber}_${moduleName}_rollback.sql`

fs.writeFileSync(path.join(partPath, fileName), "-- SQL HERE\n")
fs.writeFileSync(path.join(partPath, rollbackFileName), "-- ROLLBACK SQL HERE\n")

let changelogContent = ""
if (fs.existsSync(changelogPath)) {
  changelogContent = fs.readFileSync(changelogPath, "utf-8")
}

const newEntry = `
- id: ${newNumber}_${moduleName}
  module: ${moduleName}
  file: ../${part}/${moduleName}/${fileName}
  rollback: ../${part}/${moduleName}/${rollbackFileName}
`

fs.writeFileSync(changelogPath, changelogContent + newEntry)

console.log(`✅ Created SQL and rollback for ${part}/${moduleName}`)
