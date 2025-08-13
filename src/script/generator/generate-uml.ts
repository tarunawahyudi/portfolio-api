import fs from "fs/promises"
import path from "path"
import { createRequire } from "module"
import { createWriteStream } from "fs"
const require = createRequire(import.meta.url)
const plantuml = require("node-plantuml")

const UML_ROOT = path.join(process.cwd(), "docs", "uml")

/**
 * Executes a file stream operation, wrapping it in a Promise for async handling.
 * This helper function makes the main logic cleaner.
 *
 * @param readStream The readable stream (e.g., from plantuml.generate).
 * @param writeStream The writable stream (e.g., from fs.createWriteStream).
 * @returns A promise that resolves when the stream finishes, or rejects on error.
 */
const streamToFile = (readStream: any, writeStream: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    readStream.pipe(writeStream)
    writeStream.on("finish", resolve)
    writeStream.on("error", reject)
  })
}

/**
 * Generates PNG files from PlantUML (.puml) source files.
 * This function supports generating all files, files in a specific category,
 * or a single specific file.
 *
 * @param category - Optional. The name of the UML category (e.g., "use-case").
 * @param fileName - Optional. A specific .puml file to generate (e.g., "auth-flow.puml").
 */
async function generateUML(category?: string, fileName?: string): Promise<void> {
  try {
    // Determine which categories to process
    const categories: string[] = []
    if (category) {
      const categoryPath = path.join(UML_ROOT, category)
      const stats = await fs.stat(categoryPath).catch(() => null)
      if (!stats?.isDirectory()) {
        console.error(`❌ Error: Category "${category}" not found at ${categoryPath}.`)
        process.exit(1)
      }
      categories.push(category)
    } else {
      const allEntries = await fs.readdir(UML_ROOT)
      for (const entry of allEntries) {
        const fullPath = path.join(UML_ROOT, entry)
        const stats = await fs.stat(fullPath)
        if (stats.isDirectory() && entry !== "out") {
          categories.push(entry)
        }
      }
    }

    if (categories.length === 0) {
      console.warn("⚠️ Warning: No UML categories found. Exiting.")
      return
    }

    for (const cat of categories) {
      const categoryPath = path.join(UML_ROOT, cat)
      const outDir = path.join(categoryPath, "out")

      // Ensure the output directory exists
      await fs.mkdir(outDir, { recursive: true })

      // Determine which files to process
      let filesToGenerate: string[] = []
      if (fileName) {
        if (!fileName.endsWith(".puml")) {
          console.error(`❌ Error: Specified file "${fileName}" must have a .puml extension.`)
          continue
        }
        const filePath = path.join(categoryPath, fileName)
        const fileStats = await fs.stat(filePath).catch(() => null)
        if (!fileStats?.isFile()) {
          console.error(`❌ Error: File "${fileName}" not found in category "${cat}".`)
          continue
        }
        filesToGenerate.push(fileName)
      } else {
        const allFiles = await fs.readdir(categoryPath)
        filesToGenerate = allFiles.filter(f => f.endsWith(".puml"))
      }

      if (filesToGenerate.length === 0) {
        console.warn(`⚠️ Warning: No .puml files found in category "${cat}". Skipping.`)
        continue
      }

      for (const file of filesToGenerate) {
        const inputFile = path.join(categoryPath, file)
        const outputFile = path.join(outDir, file.replace(/\.puml$/, ".png"))

        console.log(`✨ Generating ${cat}/${file} -> ${outputFile}`)

        try {
          const readStream = plantuml.generate(inputFile, { format: "png" }).out
          const writeStream = createWriteStream(outputFile)
          await streamToFile(readStream, writeStream)
          console.log(`✅ Success: ${outputFile}`)
        } catch (error) {
          console.error(`❌ Failed to generate "${inputFile}":`, error)
        }
      }
    }

    console.log("\n🚀 All UML generation tasks completed.")

  } catch (err) {
    if (err instanceof Error) {
      console.error("Fatal error during UML generation:", err.message)
    } else {
      console.error("An unknown error occurred:", err)
    }
    process.exit(1)
  }
}

const [category, fileName] = process.argv.slice(2)

generateUML(category, fileName)
