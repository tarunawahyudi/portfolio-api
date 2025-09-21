import { injectable } from 'tsyringe'
import puppeteer, { Browser } from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import handlebars from 'handlebars'
import fs from 'fs/promises'
import path from 'path'
import { logger } from '@shared/util/logger.util'

@injectable()
export class PdfService {
  async generateCv(data: any): Promise<Buffer> {
    const templatePath = path.resolve(process.cwd(), 'resources/templates/cv-template.html')
    const templateHtml = await fs.readFile(templatePath, 'utf-8')

    const template = handlebars.compile(templateHtml)
    const finalHtml = template(data)

    let browser: Browser | null = null
    try {
      let executablePath: string | null

      if (process.env.NODE_ENV === 'production') {
        logger.info('Mode PRODUKSI: menggunakan Chromium dari @sparticuz/chromium')
        executablePath = await chromium.executablePath()
      } else {
        logger.info('Mode DEVELOPMENT: mencoba pakai Chrome/Chromium lokal')

        if (process.platform === 'win32') {
          // Windows
          executablePath =
            process.env.CHROME_PATH ||
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        } else if (process.platform === 'darwin') {
          // MacOS
          executablePath =
            process.env.CHROME_PATH ||
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        } else {
          // Linux
          executablePath =
            // eslint-disable-next-line no-constant-binary-expression
            process.env.CHROME_PATH ||
            '/usr/bin/google-chrome' ||
            '/usr/bin/chromium-browser'
        }
      }

      if (!executablePath) {
        throw new Error('Tidak menemukan path Chrome/Chromium di environment ini.')
      }

      logger.info(`Menjalankan browser dari: ${executablePath}`)

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      })

      logger.info('Browser berhasil dijalankan.')

      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 800 })
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' })

      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      })

      return Buffer.from(pdfUint8Array)
    } catch (error) {
      logger.error(`Gagal saat proses pembuatan PDF: ${error}`)
      throw new Error('Gagal membuat file PDF. Periksa log server untuk detail.')
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}
