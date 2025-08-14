import { spawnSync } from "bun"
import { join } from "path"
import chalk from "chalk"
import { config } from "dotenv"

// Load environment variables
config({ path: join(process.cwd(), ".env.local") })

// Allowed actions
type Action =
  | "up"
  | "rollback"
  | "rollbackToDate"
  | "rollbackToTag"
  | "status"
  | "tag";

// Read command line args
const actionArg = process.argv[2] as Action
const paramArg = process.argv[3] // rollbackCount / date / tag name

if (!actionArg) {
  console.log(
    chalk.yellow(
      "Usage: bun run db:migrate [up|rollback|rollbackToDate|rollbackToTag|status|tag] [param]"
    )
  )
  process.exit(1)
}

// Path to database folder (contains liquibase.properties and driver)
const dbFolder = join(process.cwd(), "infrastructure/database")

// Check Liquibase CLI availability
function checkLiquibase(): void {
  try {
    const check = spawnSync({ cmd: ["liquibase", "--version"] })
    if (check.exitCode !== 0) {
      console.log(chalk.red("❌  Liquibase CLI not found or not working properly."))
      console.log(
        chalk.blue("Please install Liquibase CLI first: https://www.liquibase.org/download")
      )
      process.exit(1)
    }
  } catch (err: any) {
    if (err?.errno === -4058 || err?.code === "ENOENT") {
      console.log(chalk.red("❌  Liquibase CLI executable not found in PATH."))
      console.log(
        chalk.blue(
          "Please install Liquibase CLI and make sure it's added to your PATH: https://www.liquibase.org/download"
        )
      )
      process.exit(1)
    } else {
      console.error(chalk.red("❌  Error checking Liquibase CLI:"), err)
      process.exit(1)
    }
  }
}

// Run Liquibase check
checkLiquibase()

// Build JDBC URL from environment
const jdbcUrl = `jdbc:postgresql://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

// Build Liquibase command
let cmd: string[] = []

switch (actionArg) {
  case "up":
    cmd = [
      "liquibase",
      "update",
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  case "rollback":
    if (!paramArg) {
      console.log(chalk.red("❌  rollbackCount is required!"))
      console.log(chalk.yellow("Example: bun run db:migrate rollback 1"))
      process.exit(1)
    }
    cmd = [
      "liquibase",
      "rollbackCount",
      paramArg,
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  case "rollbackToDate":
    if (!paramArg) {
      console.log(chalk.red("❌  Date is required! Format: YYYY-MM-DD HH:MM:SS"))
      console.log(
        chalk.yellow('Example: bun run db:migrate rollbackToDate "2025-08-14 12:00:00"')
      )
      process.exit(1)
    }
    cmd = [
      "liquibase",
      "rollbackToDate",
      paramArg,
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  case "rollbackToTag":
    if (!paramArg) {
      console.log(chalk.red("❌  Tag name is required!"))
      console.log(chalk.yellow("Example: bun run db:migrate rollbackToTag v1.0"))
      process.exit(1)
    }
    cmd = [
      "liquibase",
      "rollbackToTag",
      paramArg,
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  case "status":
    cmd = [
      "liquibase",
      "status",
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  case "tag":
    if (!paramArg) {
      console.log(chalk.red("❌  Tag name is required!"))
      console.log(chalk.yellow("Example: bun run db:migrate tag v1.0"))
      process.exit(1)
    }
    cmd = [
      "liquibase",
      "tag",
      paramArg,
      `--url=${jdbcUrl}`,
      `--username=${process.env.DB_USER}`,
      `--password=${process.env.DB_PASS}`,
      "--changeLogFile=changelog/db.changelog-master.yaml",
    ]
    break

  default:
    console.log(chalk.red(`❌  Unknown action: ${actionArg}`))
    process.exit(1)
}

console.log(chalk.cyan(`➡ Running: ${cmd.join(" ")}`))

// Run Liquibase CLI
const result = spawnSync({
  cmd,
  cwd: dbFolder,
  stdout: "pipe",
  stderr: "pipe",
  env: {
    ...process.env, // inherit all environment variables
  },
})

// Print output
if (result.stdout) console.log(chalk.green(result.stdout.toString()))
if (result.stderr) console.error(chalk.red(result.stderr.toString()))

// Check exit code
if (result.exitCode !== 0) {
  console.log(chalk.red(`❌  Migration failed with code ${result.exitCode}`))
  process.exit(result.exitCode)
}

console.log(chalk.blue("✅  Migration succeeded!"))
