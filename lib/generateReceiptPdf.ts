import type { Receipt, ReceiptItem } from '@/lib/types'

const PAYMENT_LABELS: Record<string, string> = {
  swish: 'swish',
  bg: 'bankgiro',
  kort: 'kort',
  faktura: 'faktura',
}

const COMPANY = {
  email: 'info@varvetgarn.se',
  phone: '0733-503034',
  swish: '123-143 89 93',
  bankgiro: '5479-4375',
  orgnr: '556683-4510',
  momsreg: 'SE55668345101',
  returnPolicy: 'Returer och byten enligt gällande villkor.',
}

const GOLD = [181, 146, 42] as const   // #b5922a
const DARK = [30, 16, 8] as const      // warm-900
const MID  = [100, 80, 60] as const    // warm-600

function formatSEK(n: number) {
  const rounded = Math.round(n * 100) / 100
  if (rounded === Math.round(rounded)) {
    return `${Math.round(rounded).toLocaleString('sv-SE')}:-`
  }
  return `${rounded.toFixed(2).replace('.', ',')}:-`
}

function itemTotal(item: ReceiptItem) {
  return item.quantity * item.unit_price
}

function vatSummary(items: ReceiptItem[]) {
  const map: Record<number, number> = {}
  for (const it of items) {
    const rate = it.vat_rate
    const total = itemTotal(it)
    map[rate] = (map[rate] ?? 0) + total * rate / (100 + rate)
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([rate, amount]) => ({ rate: Number(rate), amount }))
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/varvet_logo.JPG')
    const blob = await res.blob()
    return await new Promise<string>(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function generateReceiptPdf(receipt: Receipt): Promise<void> {
  // Dynamic import — only runs client-side
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ format: 'a5', unit: 'mm', orientation: 'portrait' })

  // A5: 148 × 210 mm, margin 14mm each side → content width 120mm
  const ML = 14
  const MR = 14
  const contentW = 148 - ML - MR
  let y = 14

  // Logo
  const logo = await loadLogoDataUrl()
  if (logo) {
    doc.addImage(logo, 'JPEG', ML, y, 16, 16)
    y += 22
  } else {
    y += 8
  }

  // "KVITTO"
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  doc.text('KVITTO', ML, y)
  y += 7

  // Meta lines
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`Kvittonummer: ${receipt.receipt_number}`, ML, y); y += 4.5
  doc.text(`Datum: ${receipt.receipt_date}`, ML, y); y += 4.5

  if (receipt.customer_name) {
    doc.text(`Kund: ${receipt.customer_name}`, ML, y); y += 4.5
  }

  doc.text(`Betalt: ${PAYMENT_LABELS[receipt.payment_method] ?? receipt.payment_method}`, ML, y)
  y += 7

  // Product table
  const items = [...(receipt.items ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  const rows = items.map(it => [
    it.product_name,
    String(it.quantity),
    formatSEK(it.unit_price),
    formatSEK(itemTotal(it)),
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: ML, right: MR },
    head: [['Produkt', 'Antal', 'à Pris', 'Totalt']],
    body: rows,
    styles: { fontSize: 7.5, cellPadding: 1.5, textColor: DARK },
    headStyles: {
      fillColor: false,
      textColor: DARK,
      fontStyle: 'bold',
      lineWidth: { bottom: 0.4 },
      lineColor: DARK,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 14, halign: 'left' },
      2: { cellWidth: 24, halign: 'right' },
      3: { cellWidth: 24, halign: 'right' },
    },
    alternateRowStyles: { fillColor: false },
    tableLineWidth: 0,
    didDrawPage: () => {},
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 6

  // Total
  const total = items.reduce((s, it) => s + itemTotal(it), 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  const totalLabel = 'Summa:'
  const totalValue = formatSEK(total)
  doc.text(totalLabel, ML + contentW - 40, y)
  doc.text(totalValue, ML + contentW, y, { align: 'right' })
  y += 5

  // VAT breakdown
  const vats = vatSummary(items)
  if (vats.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MID)
    const vatLine = vats.length === 1
      ? `(varav moms ${Math.round(vats[0].amount).toLocaleString('sv-SE')}:-)`
      : vats.map(v => `(varav moms ${v.rate}%: ${Math.round(v.amount).toLocaleString('sv-SE')}:-)`).join('  ')
    doc.text(vatLine, ML + contentW, y, { align: 'right' })
    y += 5
  }

  y += 4

  // Thank you
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...GOLD)
  doc.text('Tack för ditt köp!', ML, y)
  y += 8

  // Footer
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...GOLD)
  const footerLines = [
    `E-post: ${COMPANY.email}`,
    `Telefon: ${COMPANY.phone}`,
    `Swish: ${COMPANY.swish}`,
    `Bankgiro: ${COMPANY.bankgiro}`,
    `Organisationsnummer: ${COMPANY.orgnr}`,
    `Momsregistrering: ${COMPANY.momsreg}`,
  ]
  for (const line of footerLines) {
    doc.text(line, ML, y)
    y += 4
  }
  doc.setTextColor(...MID)
  doc.text(COMPANY.returnPolicy, ML, y + 1)

  doc.save(`${receipt.receipt_number}.pdf`)
}
