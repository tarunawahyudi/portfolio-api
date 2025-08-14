import fs from "fs"
import path from "path"
import yaml from "js-yaml"

async function executeSQL(sql: string) {
  console.log(sql)
}

const DB_ROOT = path.resolve("src", "db")
const masterChangelog = yaml.load(fs.readFileSync(path.join(DB_ROOT, "master-changelog.yaml"), "utf-8")) as any

async function rollback() {
  for (const part of Object.keys(masterChangelog).reverse()) {
    const files: string[] = masterChangelog[part]
    for (const changelogFile of files.reverse()) {
      const list = yaml.load(fs.readFileSync(path.join(DB_ROOT, changelogFile), "utf-8")) as any[]
      for (const entry of list.reverse()) {
        const sql = fs.readFileSync(path.join(DB_ROOT, entry.rollback), "utf-8")
        console.log(`> Rolling back ${entry.id}`)
        await executeSQL(sql)
      }
    }
  }
  console.log("✅ Rollback completed.")
}

rollback()
