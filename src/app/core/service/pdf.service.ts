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
      let executablePath = ''

      if (process.env.NODE_ENV === 'production') {
        logger.info('Production mode using: @sparticuz/chromium')
        executablePath = await chromium.executablePath()
      } else {
        logger.info('Development mode: using puppeteer that installed in devDependencies')
        const puppeteerFull = await import('puppeteer')
        executablePath = puppeteerFull.executablePath()
      }

      logger.info(`Running browser from: ${executablePath}`)

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
      })

      logger.info('Browser running success.')

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
      logger.error(`Failed creation PDF: ${error}`)
      throw new Error('Failed creation PDF')
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }
}
