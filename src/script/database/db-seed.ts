import fs from "fs"
import path from "path"
import yaml from "js-yaml"

async function executeSQL(sql: string) {
  console.log(sql)
}

const DB_ROOT = path.resolve("src", "db")
const masterChangelog = yaml.load(fs.readFileSync(path.join(DB_ROOT, "master-changelog.yaml"), "utf-8")) as any

async function seed() {
  const files: string[] = masterChangelog["seeds"]
  for (const changelogFile of files) {
    const list = yaml.load(fs.readFileSync(path.join(DB_ROOT, changelogFile), "utf-8")) as any[]
    for (const entry of list) {
      const sql = fs.readFileSync(path.join(DB_ROOT, entry.file), "utf-8")
      console.log(`> Seeding ${entry.file}`)
      await executeSQL(sql)
    }
  }
  console.log("✅ Seed completed.")
}

seed()
