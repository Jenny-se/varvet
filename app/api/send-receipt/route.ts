import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const COMPANY = {
  name: 'Varvet Garn',
  email: 'info@varvetgarn.se',
  phone: '0733-503034',
  swish: '123-143 89 93',
  bankgiro: '5479-4375',
  orgnr: '556683-4510',
  momsreg: 'SE55668345101',
  returnPolicy: 'Returer och byten enligt gällande villkor.',
}

function formatSEK(n: number) {
  return `${Math.round(n).toLocaleString('sv-SE')}:-`
}

function buildEmailHtml(receipt: {
  receipt_number: string
  receipt_date: string
  customer_name: string | null
  payment_method: string
  items: { product_name: string; quantity: number; unit_price: number; vat_rate: number }[]
}) {
  const PAYMENT_LABELS: Record<string, string> = {
    swish: 'Swish', kontant: 'Kontant', kort: 'Kort', faktura: 'Faktura',
  }

  const total = receipt.items.reduce((s, it) => s + it.quantity * it.unit_price, 0)

  const vatMap: Record<number, number> = {}
  for (const it of receipt.items) {
    const vat = it.quantity * it.unit_price * it.vat_rate / (100 + it.vat_rate)
    vatMap[it.vat_rate] = (vatMap[it.vat_rate] ?? 0) + vat
  }
  const vats = Object.entries(vatMap)
    .filter(([, v]) => v > 0)
    .sort(([a], [b]) => Number(b) - Number(a))

  const itemRows = receipt.items.map(it => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;color:#3d2b1f;">${it.product_name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;color:#3d2b1f;text-align:center;">${it.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;color:#3d2b1f;text-align:right;">${formatSEK(it.unit_price)}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;color:#3d2b1f;text-align:right;">${formatSEK(it.quantity * it.unit_price)}</td>
    </tr>
  `).join('')

  const vatRows = vats.map(([rate, amount]) => `
    <tr>
      <td colspan="3" style="padding:4px 0;color:#7a6352;font-size:13px;">Varav moms ${rate}%</td>
      <td style="padding:4px 0;color:#7a6352;font-size:13px;text-align:right;">${formatSEK(Number(amount))}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f1e2;font-family:system-ui,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;padding:48px;border-radius:8px;">

    <h2 style="font-size:14px;font-weight:700;letter-spacing:0.1em;color:#1e1008;margin:0 0 24px;">KVITTO</h2>

    <p style="margin:0 0 4px;font-size:14px;color:#3d2b1f;">Kvittonummer: <strong>${receipt.receipt_number}</strong></p>
    <p style="margin:0 0 4px;font-size:14px;color:#3d2b1f;">Datum: ${receipt.receipt_date}</p>
    ${receipt.customer_name ? `<p style="margin:0 0 4px;font-size:14px;color:#3d2b1f;">Kund: ${receipt.customer_name}</p>` : ''}
    <p style="margin:0 0 24px;font-size:14px;color:#3d2b1f;">Betalt: ${PAYMENT_LABELS[receipt.payment_method] ?? receipt.payment_method}</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <thead>
        <tr style="border-bottom:2px solid #1e1008;">
          <th style="text-align:left;padding:8px 0;font-size:13px;color:#1e1008;">Produkt</th>
          <th style="text-align:center;padding:8px 0;font-size:13px;color:#1e1008;width:50px;">Antal</th>
          <th style="text-align:right;padding:8px 0;font-size:13px;color:#1e1008;width:90px;">à Pris</th>
          <th style="text-align:right;padding:8px 0;font-size:13px;color:#1e1008;width:90px;">Totalt</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        ${vatRows}
        <tr>
          <td colspan="3" style="padding:12px 0 4px;font-weight:600;font-size:14px;color:#1e1008;border-top:1px solid #e8dcc8;">Summa</td>
          <td style="padding:12px 0 4px;font-weight:600;font-size:14px;color:#1e1008;text-align:right;border-top:1px solid #e8dcc8;">${formatSEK(total)}</td>
        </tr>
      </tbody>
    </table>

    <p style="font-size:15px;font-weight:600;color:#b5922a;margin:32px 0 24px;">Tack för ditt köp!</p>

    <div style="font-size:12px;color:#b5922a;line-height:1.8;">
      <p style="margin:0;">E-post: ${COMPANY.email}</p>
      <p style="margin:0;">Telefon: ${COMPANY.phone}</p>
      <p style="margin:0;">Swish: ${COMPANY.swish}</p>
      <p style="margin:0;">Bankgiro: ${COMPANY.bankgiro}</p>
      <p style="margin:0;">Organisationsnummer: ${COMPANY.orgnr}</p>
      <p style="margin:0;">Momsregistrering: ${COMPANY.momsreg}</p>
      <p style="margin:8px 0 0;color:#7a6352;">${COMPANY.returnPolicy}</p>
    </div>
  </div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, receipt } = body as {
      email: string
      receipt: {
        receipt_number: string
        receipt_date: string
        customer_name: string | null
        payment_method: string
        items: { product_name: string; quantity: number; unit_price: number; vat_rate: number }[]
      }
    }

    if (!email || !receipt) {
      return NextResponse.json({ error: 'email och receipt krävs' }, { status: 400 })
    }

    const html = buildEmailHtml(receipt)

    const { error } = await resend.emails.send({
      from: `${COMPANY.name} <${COMPANY.email}>`,
      to: email,
      subject: `Kvitto ${receipt.receipt_number} – ${COMPANY.name}`,
      html,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
