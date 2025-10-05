import fs from 'fs/promises'
import path from 'path'

const defaultLocale = 'en'

export async function getTranslations(locale: string = defaultLocale) {
  const localeToTry = locale
  const defaultLocalePath = path.resolve(process.cwd(), `resources/locales/${defaultLocale}.json`)
  let localePath = path.resolve(process.cwd(), `resources/locales/${localeToTry}.json`)

  try {
    await fs.access(localePath)
  } catch (error) {
    console.log(error)
    localePath = defaultLocalePath
  }

  const fileContent = await fs.readFile(localePath, 'utf-8')
  return JSON.parse(fileContent)
}
