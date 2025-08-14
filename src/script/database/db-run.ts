import fs from "fs"
import path from "path"
import yaml from "js-yaml"
import pkg from "pg"
const { Client } = pkg

const DB_ROOT = path.resolve("src", "db")
const MASTER_CHANGELOG = path.join(DB_ROOT, "master-changelog.yaml")

const master = yaml.load(fs.readFileSync(MASTER_CHANGELOG, "utf-8")) as Record<string, string[]>

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "mydb",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
})

async function runSQL(filePath: string) {
  const absPath = path.resolve(DB_ROOT, filePath)
  if (!fs.existsSync(absPath)) {
    console.error(`❌ File not found: ${filePath}`)
    return
  }

  const sql = fs.readFileSync(absPath, "utf-8")
  console.log(`> Running: ${filePath}`)

  try {
    await client.query(sql)
    console.log(`✅ Success: ${filePath}`)
  } catch (err) {
    console.error(`❌ Failed: ${filePath}`, err)
    throw err
  }
}

async function runAll() {
  await client.connect()
  try {
    for (const partKey in master) {
      const changelogFiles: string[] = master[partKey]
      for (const changelogFile of changelogFiles) {
        const list = yaml.load(
          fs.readFileSync(path.resolve(DB_ROOT, changelogFile), "utf-8")
        ) as { file: string }[]

        for (const entry of list) {
          await runSQL(entry.file)
        }
      }
    }

    console.log("✅ All migrations applied successfully.")
  } catch (err) {
    console.error("❌ Migration process failed.", err)
  } finally {
    await client.end()
  }
}

runAll()
