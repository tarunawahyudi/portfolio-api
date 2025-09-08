import { Pool } from "pg"
import readline from "readline"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function askConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    console.log("\n⚠️  DANGER ZONE ⚠️")
    console.log("This action will DROP ALL TABLES and DELETE ALL DATA in the database.")
    console.log("This operation is irreversible!")
    rl.question('Type "RESET" (in uppercase) to continue ➜ ', (answer) => {
      rl.close()
      resolve(answer.trim() === "RESET")
    })
  })
}

async function resetDatabase() {
  console.log("\n🔨  Resetting database schema …")
  await pool.query("BEGIN")
  await pool.query(`DROP SCHEMA public CASCADE`)
  await pool.query(`CREATE SCHEMA public`)
  await pool.query(`GRANT ALL ON SCHEMA public TO public`)
  await pool.query("COMMIT")
  console.log("✅  Database schema reset completed.")
}

async function main() {
  const confirmed = await askConfirmation()
  if (!confirmed) {
    console.log("❌  Operation cancelled.")
    process.exit(0)
  }

  try {
    await resetDatabase()
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error("❌  Reset failed:", err)
  process.exit(1)
})
