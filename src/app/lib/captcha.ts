import { AppException } from '@core/exception/app.exception'
import { logger } from '@sentry/bun'

export async function verifyCaptcha(token: string, ip?: string) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  if (!secret) throw new AppException('CONFIG-001')

  const body = new FormData()
  body.append('secret', secret)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })

  const result = await response.json() as { success: boolean, 'error-codes'?: string[] }
  if (!result.success) {
    logger.warn(`Verifikasi Turnstile gagal: ${result['error-codes']}`)
    throw new AppException('CAPTCHA-001', 'Verifikasi keamanan gagal. Silakan muat ulang halaman.')
  }
}
