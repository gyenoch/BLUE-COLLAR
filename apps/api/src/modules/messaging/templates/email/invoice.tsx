import * as React from 'react';

interface InvoiceEmailProps {
  customerName: string | null;
  businessName: string;
  businessPhone: string;
  serviceType: string | null;
  completionNotes: string | null;
  actualCost: number;
  partsUsed?: { name: string; cost: number }[];
  paymentLink?: string;
}

export function renderInvoiceEmail(props: InvoiceEmailProps): string {
  const {
    customerName, businessName, businessPhone,
    serviceType, completionNotes, actualCost, partsUsed, paymentLink,
  } = props;

  const name = customerName ?? 'Valued Customer';
  const service = serviceType ?? 'Service';
  const partsRows = (partsUsed ?? [])
    .map(
      (p) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${p.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">$${p.cost.toFixed(2)}</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice — ${businessName}</title>
</head>
<body style="font-family:sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#16a34a;margin-bottom:4px;">Invoice</h1>
  <p style="color:#6b7280;margin-top:0;">from ${businessName}</p>

  <p>Hi ${name},</p>
  <p>Thank you for choosing ${businessName}! Here's your invoice for <strong>${service}</strong>.</p>

  ${completionNotes ? `<p><em>${completionNotes}</em></p>` : ''}

  <table style="width:100%;border-collapse:collapse;margin:24px 0;">
    <thead>
      <tr style="background:#f3f4f6;">
        <th style="padding:10px;text-align:left;">Item</th>
        <th style="padding:10px;text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${partsRows}
      <tr>
        <td style="padding:12px;font-weight:700;">Total</td>
        <td style="padding:12px;font-weight:700;text-align:right;">$${actualCost.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  ${
    paymentLink
      ? `<p>
           <a href="${paymentLink}"
              style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
             Pay Online
           </a>
         </p>`
      : ''
  }

  <p>Questions? Call us at <a href="tel:${businessPhone}" style="color:#2563eb;">${businessPhone}</a>.</p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
  <p style="font-size:12px;color:#9ca3af;">${businessName} · Powered by Blue-Collar Agent</p>
</body>
</html>
  `.trim();
}
