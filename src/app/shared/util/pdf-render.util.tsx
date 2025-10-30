import * as React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { CVDocument } from '@resources/components/pdf/CVDocument'

export async function renderCVToBuffer(data: any): Promise<Buffer> {
  const pdfUint8Array = await renderToBuffer(<CVDocument data={data} t={data.t} />)
  return Buffer.from(pdfUint8Array as unknown as Uint8Array)
}
