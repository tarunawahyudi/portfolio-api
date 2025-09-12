import readline from 'readline'
import { Pool } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname'
const pool = new Pool({ connectionString: DATABASE_URL })

/** tables you DO NOT want to truncate */
const EXCLUDED_TABLES = ['migrations'] // add more if needed

/* ───────────────── confirmation prompt ───────────────── */
function confirm() {
  return new Promise((res) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    console.log('\n⚠️  DANGER ZONE ⚠️')
    console.log('This will DELETE **ALL ROWS** in every table (schema stays).')
    rl.question('Type "WIPE" to continue ➜ ', (ans) => {
      rl.close()
      res(ans.trim() === 'WIPE')
    })
  })
}

/* ───────────────── truncate all tables ───────────────── */
async function wipeAllData() {
  const { rows } = await pool.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN (${EXCLUDED_TABLES.map((t) => `'${t}'`).join(',')})
  `)

  if (rows.length === 0) {
    console.log('Nothing to truncate (no tables found).')
    return
  }

  const tableNames = rows.map((r) => `"public"."${r.tablename}"`).join(', ')
  console.log(`Truncating tables: ${tableNames}`)

  await pool.query('BEGIN')
  await pool.query(`TRUNCATE ${tableNames} CASCADE;`)
  await pool.query('COMMIT')
  console.log('✅  All table data wiped.')
}

/* ───────────────── main ───────────────── */
;(async () => {
  if (!(await confirm())) {
    console.log('Operation cancelled.')
    process.exit(0)
  }

  try {
    await wipeAllData()
  } finally {
    await pool.end()
  }
})().catch((e) => {
  console.error('❌  Wipe failed:', e)
  process.exit(1)
})
