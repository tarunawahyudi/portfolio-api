import { injectable } from 'tsyringe'
import { jsPDF } from 'jspdf'
import { logger } from '@shared/util/logger.util'

async function loadImageData(url: string): Promise<{ dataUrl: string; format: string } | null> {
  if (!url) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      logger.error(`Gagal fetch gambar: Status HTTP ${response.status} dari ${url}`)
      return null
    }

    const contentType = response.headers.get('content-type')
    let format = 'JPEG'
    if (contentType) {
      if (contentType.includes('png')) format = 'PNG'
      else if (contentType.includes('gif')) format = 'GIF'
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    logger.info(`Gambar profil berhasil dimuat dan dikonversi: ${format}`)

    return {
      dataUrl: `data:${contentType || 'image/jpeg'};base64,${base64}`,
      format: format,
    }
  } catch (e: any) {
    if (e.name === 'AbortError') {
      logger.error(`Fetch gambar profil ${url} dibatalkan karena timeout (10 detik).`)
    } else {
      logger.error(`Error kritis saat memuat gambar dari URL ${url}: ${e.message}`)
    }
    return null
  }
}

@injectable()
export class PdfService {
  async generateCv(data: any): Promise<Buffer> {
    try {
      logger.info('Generating PDF using jsPDF with improved layout')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth() // 210mm (A4)
      const pageHeight = pdf.internal.pageSize.getHeight() // 297mm (A4)
      const maxSidebarY = pageHeight - 15

      // === KONSTANTA TATA LETAK ===
      const margin = 15
      const sidebarWidth = 65
      const sidebarPadding = 8

      const mainXStart = margin + sidebarWidth + margin
      const mainWidth = pageWidth - mainXStart - margin
      const sidebarXStart = margin

      // Posisi Awal Konten
      let sidebarY = margin + 15
      let mainY = margin + 15

      // Helper untuk merender ulang Sidebar Background
      const redrawSidebarBackground = (pdf: jsPDF) => {
        pdf.setFillColor(31, 41, 55) // gray-800
        pdf.rect(sidebarXStart, margin, sidebarWidth, pageHeight - margin * 2, 'F')
      }

      redrawSidebarBackground(pdf)

      // Helper untuk menghitung lebar teks
      const calculateTextWidth = (text: string, size: number, style: string): number => {
        pdf.setFontSize(size)
        pdf.setFont('helvetica', style)
        return pdf.getTextWidth(text)
      }

      // Helper untuk membagi teks
      const splitTextByWidth = (
        text: string,
        maxWidth: number,
        size: number,
        style: string,
      ): string[] => {
        pdf.setFontSize(size)
        pdf.setFont('helvetica', style)
        return pdf.splitTextToSize(text, maxWidth)
      }

      const sidebarContentX = sidebarXStart + sidebarWidth / 2
      const profilePhotoSize = 30
      const profilePhotoRadius = profilePhotoSize / 2

      if (data.profile.avatarUrl) {
        const imageData = await loadImageData(data.profile.avatarUrl)

        const photoX = sidebarContentX - profilePhotoRadius
        const photoY = sidebarY

        if (imageData && imageData.dataUrl) {
          try {
            pdf.saveGraphicsState()
            pdf.setDrawColor(31, 41, 55)
            pdf.setFillColor(31, 41, 55)
            pdf.circle(sidebarContentX, photoY + profilePhotoRadius, profilePhotoRadius, 'CN')

            pdf.addImage(
              imageData.dataUrl,
              imageData.format,
              photoX,
              photoY,
              profilePhotoSize,
              profilePhotoSize,
            )

            pdf.restoreGraphicsState()
          } catch (e: any) {
            logger.error(`Error saat mencoba addImage/circle: ${e.message}`)
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'italic')
            pdf.text('[Error Memuat Gambar]', sidebarContentX, photoY + profilePhotoRadius, {
              align: 'center',
            })
          }
          sidebarY += profilePhotoSize + 10
        } else {
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'italic')
          pdf.text('[Error Memuat Gambar]', sidebarContentX, photoY + profilePhotoRadius, {
            align: 'center',
          })
          sidebarY += profilePhotoSize + 10
        }
      }

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      const nameLines = splitTextByWidth(
        data.profile.fullName,
        sidebarWidth - sidebarPadding * 2,
        20,
        'bold',
      )
      nameLines.forEach((line, index) => {
        pdf.text(line, sidebarContentX, sidebarY + index * 8, { align: 'center' })
      })
      sidebarY += nameLines.length * 8 + 6

      // Jabatan
      pdf.setTextColor(45, 212, 191)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      const titleLines = splitTextByWidth(
        data.profile.jobTitle,
        sidebarWidth - sidebarPadding * 2,
        12,
        'normal',
      )
      titleLines.forEach((line, index) => {
        pdf.text(line, sidebarContentX, sidebarY + index * 5, { align: 'center' })
      })
      sidebarY += titleLines.length * 5 + 15

      // --- BAGIAN KONTAK ---
      const contactX = sidebarXStart + sidebarPadding
      const contactWidth = sidebarWidth - sidebarPadding * 2

      if (sidebarY > maxSidebarY - 50) {
        pdf.addPage()
        redrawSidebarBackground(pdf)
        sidebarY = margin + 15
      }

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.t.contact.toUpperCase(), contactX, sidebarY)
      sidebarY += 5

      pdf.setDrawColor(45, 212, 191)
      pdf.setLineWidth(1)
      pdf.line(contactX, sidebarY, sidebarXStart + sidebarWidth - sidebarPadding, sidebarY)
      sidebarY += 8

      pdf.setFontSize(9)
      const contactItems = [
        { label: data.t.email || 'Email', value: data.profile.email },
        { label: data.t.phone || 'Telepon', value: data.profile.phoneNumber },
        { label: data.t.website || 'Situs Web', value: data.profile.website },
        { label: data.t.address || 'Alamat', value: data.profile.address },
      ]

      contactItems.forEach((item) => {
        if (sidebarY > maxSidebarY - 10) {
          pdf.addPage()
          redrawSidebarBackground(pdf)
          sidebarY = margin + 15
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text(data.t.contact.toUpperCase(), contactX, sidebarY)
          sidebarY += 5
          pdf.setDrawColor(45, 212, 191)
          pdf.line(contactX, sidebarY, sidebarXStart + sidebarWidth - sidebarPadding, sidebarY)
          sidebarY += 8
        }

        const labelText = `${item.label}:`
        pdf.setFont('helvetica', 'bold')
        pdf.text(labelText, contactX, sidebarY)
        sidebarY += 4

        pdf.setFont('helvetica', 'normal')
        const valueText = item.value || '-'
        const valueLines = splitTextByWidth(valueText, contactWidth, 9, 'normal')

        valueLines.forEach((line, index) => {
          pdf.text(line, contactX, sidebarY + index * 4)
        })

        sidebarY += valueLines.length * 4 + 4
      })

      sidebarY += 10

      if (sidebarY > maxSidebarY - 50) {
        pdf.addPage()
        redrawSidebarBackground(pdf)
        sidebarY = margin + 15
      }

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.t.skills.toUpperCase(), contactX, sidebarY)
      sidebarY += 5

      pdf.setDrawColor(45, 212, 191)
      pdf.line(contactX, sidebarY, sidebarXStart + sidebarWidth - sidebarPadding, sidebarY)
      sidebarY += 8

      const tagHeight = 5
      const tagPadding = 2
      const tagSpacing = 3
      let tagX = contactX
      let tagY = sidebarY

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)

      data.skills.forEach((skill: any) => {
        const skillText = skill.name
        const textWidth = calculateTextWidth(skillText, 8, 'normal')
        const tagWidth = textWidth + tagPadding * 2

        let nextTagY = tagY
        let nextTagX = tagX

        if (tagX + tagWidth > sidebarXStart + sidebarWidth - sidebarPadding) {
          nextTagX = contactX
          nextTagY += tagHeight + tagSpacing
        }

        if (nextTagY > maxSidebarY - (tagHeight + tagSpacing)) {
          pdf.addPage()
          redrawSidebarBackground(pdf)
          tagY = margin + 15
          tagX = contactX

          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'bold')
          pdf.text(data.t.skills.toUpperCase(), contactX, tagY)
          tagY += 5
          pdf.setDrawColor(45, 212, 191)
          pdf.line(contactX, tagY, sidebarXStart + sidebarWidth - sidebarPadding, tagY)
          tagY += 8

          nextTagX = tagX
          nextTagY = tagY
        }

        tagX = nextTagX
        tagY = nextTagY

        pdf.setFillColor(55, 65, 81)
        pdf.roundedRect(tagX, tagY, tagWidth, tagHeight, 1, 1, 'F')

        pdf.setTextColor(255, 255, 255)
        pdf.text(skillText, tagX + tagPadding, tagY + 3.5)

        tagX += tagWidth + tagSpacing
      })

      if (data.skills.length > 0) {
        sidebarY = tagY + tagHeight + 10
      } else {
        sidebarY += 5
      }

      // =========================================================================================================
      // ===== KONTEN UTAMA (Dipastikan dimulai di Halaman 1) =====
      // =========================================================================================================

      // --- BAGIAN PROFIL ---
      // SOLUSI UTAMA: Tambahkan Pengecekan Halaman di Awal Konten Utama
      // Ini memaksa PDF untuk memeriksa apakah ia perlu menambahkan halaman baru.
      // Jika Konten Utama ada, ia akan dicetak di halaman pertama.
      if (pdf.internal.pages.length === 1 && mainY > pageHeight - margin) {
        // Hanya terjadi jika Halaman 1 sudah penuh, yang mustahil di sini.
        pdf.addPage()
        mainY = margin + 15
        redrawSidebarBackground(pdf)
      } else if (pdf.internal.pages.length > 1 && mainY > pageHeight - margin) {
        // Logika normal untuk halaman berikutnya jika penuh
        pdf.addPage()
        mainY = margin + 15
        redrawSidebarBackground(pdf)
      }

      pdf.setTextColor(17, 24, 39)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.t.profile.toUpperCase(), mainXStart, mainY)
      mainY += 5

      pdf.setDrawColor(209, 213, 219)
      pdf.setLineWidth(1)
      pdf.line(mainXStart, mainY, mainXStart + mainWidth, mainY)
      mainY += 8

      // Bio
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(17, 24, 39)
      const bioText = this.stripHtml(data.profile.bio)
      const bioLines = splitTextByWidth(bioText, mainWidth, 10, 'normal')
      bioLines.forEach((line) => {
        pdf.text(line, mainXStart, mainY)
        mainY += 4.5
      })

      mainY += 12

      // --- BAGIAN PENGALAMAN KERJA ---
      if (mainY > pageHeight - 45) {
        pdf.addPage()
        mainY = margin + 15
        redrawSidebarBackground(pdf)
      }

      pdf.setTextColor(17, 24, 39)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.t.workExperience.toUpperCase(), mainXStart, mainY)
      mainY += 5

      pdf.setDrawColor(209, 213, 219)
      pdf.line(mainXStart, mainY, mainXStart + mainWidth, mainY)
      mainY += 8

      data.experiences.forEach((exp: any) => {
        if (mainY > pageHeight - 45) {
          pdf.addPage()
          mainY = margin + 15
          redrawSidebarBackground(pdf)
        }

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.setTextColor(17, 24, 39)
        pdf.text(exp.position, mainXStart, mainY)

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(107, 114, 128)
        const dateText = exp.isCurrent
          ? `${exp.startDate} - ${data.t.present}`
          : `${exp.startDate} - ${exp.endDate}`
        pdf.text(dateText, mainXStart + mainWidth, mainY, { align: 'right' })
        mainY += 6

        pdf.setTextColor(55, 65, 81)
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'bold')
        pdf.text(exp.company, mainXStart, mainY)
        mainY += 7

        if (exp.jobDesk && exp.jobDesk.length > 0) {
          pdf.setTextColor(17, 24, 39)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')

          const bulletIndent = 5
          const bulletAreaWidth = mainWidth - bulletIndent

          exp.jobDesk.forEach((task: string) => {
            if (mainY > pageHeight - 25) {
              pdf.addPage()
              mainY = margin + 15
              redrawSidebarBackground(pdf)
            }

            const taskLines = splitTextByWidth(task, bulletAreaWidth - 4, 10, 'normal')

            pdf.text('•', mainXStart, mainY)
            pdf.text(taskLines[0], mainXStart + bulletIndent, mainY)
            mainY += 4

            for (let i = 1; i < taskLines.length; i++) {
              pdf.text(taskLines[i], mainXStart + bulletIndent, mainY)
              mainY += 4
            }
            mainY += 2
          })
        }

        mainY += 10
      })

      // --- BAGIAN PENDIDIKAN (EDUCATION) ---
      if (mainY > pageHeight - 45) {
        pdf.addPage()
        mainY = margin + 15
        redrawSidebarBackground(pdf)
      }

      pdf.setTextColor(17, 24, 39)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(data.t.education.toUpperCase(), mainXStart, mainY)
      mainY += 5

      pdf.setDrawColor(209, 213, 219)
      pdf.line(mainXStart, mainY, mainXStart + mainWidth, mainY)
      mainY += 8

      data.educations.forEach((edu: any) => {
        if (mainY > pageHeight - 35) {
          pdf.addPage()
          mainY = margin + 15
          redrawSidebarBackground(pdf)
        }

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.setTextColor(17, 24, 39)
        pdf.text(edu.institution, mainXStart, mainY)
        mainY += 6

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(55, 65, 81)
        const degreeText = `${edu.degree} - ${edu.fieldOfStudy}`
        pdf.text(degreeText, mainXStart, mainY)
        mainY += 5

        pdf.setFontSize(9)
        pdf.setTextColor(107, 114, 128)
        const eduDateText = `${edu.startDate} - ${edu.endDate}`
        pdf.text(eduDateText, mainXStart, mainY)
        mainY += 10
      })

      logger.info('PDF generation successful')

      return Buffer.from(pdf.output('arraybuffer'))
    } catch (error) {
      logger.error(`Failed to create PDF: ${error}`)
      throw new Error('Failed creation PDF')
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
  }
}
