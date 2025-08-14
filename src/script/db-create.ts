import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import prompts from "prompts"

type MigrationType = "schema" | "seed" | "patch"
type FileType = "sql" | "yaml"

const migrationName = process.argv[2]
let migrationType = process.argv[3] as MigrationType | undefined
const fileType = (process.argv[4] as FileType) || "yaml"

if (!migrationName) {
  console.log(chalk.yellow("Usage: bun run db:create <name> [schema|seed|patch] [sql|yaml]"))
  process.exit(1)
}

async function getMigrationType(): Promise<MigrationType> {
  if (migrationType) return migrationType
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Select migration type",
    choices: [
      { title: "Schema", value: "schema" },
      { title: "Seed", value: "seed" },
      { title: "Patch", value: "patch" },
    ],
  })
  return response.value as MigrationType
}

// Timestamp helper
function timestamp(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

async function addToChangelog(migType: MigrationType, fileName: string) {
  const changelogFile = path.join(process.cwd(), "infrastructure/database/changelog", migType, `changelog-${migType}.yaml`)
  if (await fs.pathExists(changelogFile)) {
    await fs.readFile(changelogFile, "utf-8")
  } else {
    await fs.ensureFile(changelogFile)
  }

  const changeset = `
  - changeSet:
      id: ${timestamp()}-${migrationName}
      author: developer
      ${fileType === "sql" ? `sqlFile: ${fileName}` : `include: ${fileName}`}
  `

  await fs.appendFile(changelogFile, changeset)
  console.log(chalk.green(`✅ Changeset added to ${changelogFile}`))
}

async function main() {
  const type = await getMigrationType()
  migrationType = type

  const folder = path.join(process.cwd(), "infrastructure/database/changelog", type)
  await fs.ensureDir(folder)

  const fileName = `${timestamp()}-${migrationName}.${fileType}`
  const filePath = path.join(folder, fileName)

  if (fileType === "sql") {
    await fs.writeFile(filePath, "-- Write your SQL here\n")
  } else {
    await fs.writeFile(filePath, "---\n# Write your YAML changeset here\n")
  }

  console.log(chalk.blue(`➡ Migration file created: ${filePath}`))

  await addToChangelog(type, fileName)
}

main().catch(err => {
  console.error(chalk.red("❌ Error:"), err)
  process.exit(1)
})
