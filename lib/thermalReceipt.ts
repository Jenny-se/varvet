import { format } from 'date-fns'
import type { Receipt, ReceiptItem } from '@/lib/types'

// Kvitto som bild för PeriPage A6/A9 (58 mm-rulle, 384 punkter bred).
// Bilden delas via telefonens dela-meny till PeriPage-appen som skriver ut den.

const WIDTH = 384
const PAD = 12
const FONT = 'Helvetica, Arial, sans-serif'

const PAYMENT_LABELS: Record<string, string> = { swish: 'Swish', bg: 'Bankgiro', kort: 'Kort', faktura: 'Faktura' }

const COMPANY = {
  email: 'info@varvetgarn.se',
  swish: '123-143 89 93',
  orgnr: '556683-4510',
  legalName: 'Stepwise',
}

function formatSEK(n: number) {
  const rounded = Math.round(n * 100) / 100
  if (rounded === Math.round(rounded)) return `${Math.round(rounded).toLocaleString('sv-SE')}:-`
  return `${rounded.toFixed(2).replace('.', ',')}:-`
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function renderThermalReceipt(receipt: Receipt): Promise<HTMLCanvasElement> {
  const items: ReceiptItem[] = [...(receipt.items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const total = items.reduce((s, it) => s + it.quantity * it.unit_price, 0)
  const vats: Record<number, number> = {}
  for (const it of items) {
    const t = it.quantity * it.unit_price
    vats[it.vat_rate] = (vats[it.vat_rate] ?? 0) + t * it.vat_rate / (100 + it.vat_rate)
  }
  const logo = await loadImage('/varvet_logo.JPG')

  // Ritar två gånger: först för att mäta höjden, sedan på riktigt
  const draw = (ctx: CanvasRenderingContext2D) => {
    let y = PAD
    ctx.fillStyle = '#000'
    ctx.textBaseline = 'top'

    const text = (s: string, size: number, opts: { bold?: boolean; align?: 'left' | 'center' | 'right'; gap?: number } = {}) => {
      ctx.font = `${opts.bold ? 'bold ' : ''}${size}px ${FONT}`
      ctx.textAlign = opts.align ?? 'left'
      const x = opts.align === 'center' ? WIDTH / 2 : opts.align === 'right' ? WIDTH - PAD : PAD
      ctx.fillText(s, x, y)
      y += size + (opts.gap ?? 6)
    }
    const row = (left: string, right: string, size: number, bold = false) => {
      ctx.font = `${bold ? 'bold ' : ''}${size}px ${FONT}`
      ctx.textAlign = 'left'
      ctx.fillText(left, PAD, y)
      ctx.textAlign = 'right'
      ctx.fillText(right, WIDTH - PAD, y)
      y += size + 6
    }
    const wrap = (s: string, size: number, maxWidth: number, bold = false) => {
      ctx.font = `${bold ? 'bold ' : ''}${size}px ${FONT}`
      const lines: string[] = []
      let line = ''
      for (const word of s.split(' ')) {
        const next = line ? `${line} ${word}` : word
        if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word } else line = next
      }
      if (line) lines.push(line)
      return lines
    }
    const rule = (thick = 2) => {
      y += 4
      ctx.fillRect(PAD, y, WIDTH - PAD * 2, thick)
      y += thick + 10
    }

    if (logo) {
      const size = 96
      ctx.drawImage(logo, (WIDTH - size) / 2, y, size, size * logo.height / logo.width)
      y += size * logo.height / logo.width + 10
    } else {
      text('VARVET GARN', 30, { bold: true, align: 'center', gap: 10 })
    }

    text('KVITTO', 24, { bold: true, align: 'center', gap: 10 })
    row('Kvittonr', receipt.receipt_number, 20)
    row('Datum', format(new Date(receipt.receipt_date), 'yyyy-MM-dd'), 20)
    if (receipt.customer_name) row('Kund', receipt.customer_name, 20)
    rule()

    for (const it of items) {
      for (const line of wrap(it.product_name, 22, WIDTH - PAD * 2, true)) text(line, 22, { bold: true, gap: 4 })
      row(`${it.quantity} × ${formatSEK(it.unit_price)}`, formatSEK(it.quantity * it.unit_price), 20)
      y += 4
    }
    rule()

    row('SUMMA', formatSEK(total), 28, true)
    for (const [rate, amount] of Object.entries(vats).sort(([a], [b]) => Number(b) - Number(a))) {
      if (amount > 0) row(`varav moms ${rate}%`, formatSEK(amount), 18)
    }
    row('Betalt med', PAYMENT_LABELS[receipt.payment_method] ?? receipt.payment_method, 20)
    rule(1)

    text('Tack för ditt köp!', 24, { bold: true, align: 'center', gap: 12 })
    text(COMPANY.email, 18, { align: 'center' })
    text(`Swish ${COMPANY.swish}`, 18, { align: 'center' })
    text(`Org.nr ${COMPANY.orgnr} ${COMPANY.legalName}`, 18, { align: 'center' })
    return y + PAD * 3
  }

  const measure = document.createElement('canvas').getContext('2d')!
  const height = Math.ceil(draw(measure))

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, WIDTH, height)
  draw(ctx)
  return canvas
}

// Öppnar dela-menyn (iPhone: välj PeriPage, eller "Spara bild" och skriv ut från PeriPage-appen).
// Där delning saknas laddas bilden ner i stället.
export async function shareThermalReceipt(receipt: Receipt) {
  const canvas = await renderThermalReceipt(receipt)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Kunde inte skapa bilden'))), 'image/png'))
  const file = new File([blob], `kvitto-${receipt.receipt_number}.png`, { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
    } catch (err) {
      if ((err as Error).name !== 'AbortError') throw err
    }
    return
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}
