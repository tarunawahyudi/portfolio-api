import { injectable } from 'tsyringe'
import puppeteer from 'puppeteer-core'
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

    let browser = null
    try {
      let executablePath = ''

      if (process.env.NODE_ENV === 'production') {
        logger.info('Mode Produksi: Menggunakan @sparticuz/chromium')
      } else {
        logger.info('Mode Development: Menggunakan Google Chrome lokal')
        executablePath = process.env.CHROME_PATH!
        try {
          await fs.access(executablePath)
        } catch (e) {
          console.error(e)
          logger.error(`Google Chrome tidak ditemukan di path: ${executablePath}`)
          logger.error('Pastikan path di pdf.service.ts sudah benar atau Google Chrome sudah terinstal.')
          throw new Error('Google Chrome executable not found.')
        }
      }

      logger.info(`Mencoba menjalankan browser dari: ${executablePath}`)

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: executablePath,
        headless: true,
      })

      logger.info('Browser berhasil dijalankan.')
      const page = await browser.newPage()

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
