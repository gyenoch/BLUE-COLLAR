import * as React from 'react';
import { formatAppointmentTime } from '../../../../utils/helpers';

interface ConfirmationEmailProps {
  customerName: string | null;
  businessName: string;
  businessPhone: string;
  scheduledTime: Date;
  serviceType: string | null;
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
  timezone: string;
}

export function renderConfirmationEmail(props: ConfirmationEmailProps): string {
  const {
    customerName, businessName, businessPhone,
    scheduledTime, serviceType, estimatedCostMin, estimatedCostMax, timezone,
  } = props;

  const name = customerName ?? 'Valued Customer';
  const time = formatAppointmentTime(scheduledTime, timezone);
  const service = serviceType ?? 'Service Visit';
  const costRange =
    estimatedCostMin && estimatedCostMax
      ? `$${estimatedCostMin}–$${estimatedCostMax}`
      : 'To be determined on-site';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Appointment Confirmation — ${businessName}</title>
</head>
<body style="font-family:sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#2563eb;margin-bottom:4px;">Appointment Confirmed ✓</h1>
  <p style="color:#6b7280;margin-top:0;">from ${businessName}</p>

  <p>Hi ${name},</p>
  <p>Your appointment has been scheduled. Here are the details:</p>

  <table style="width:100%;border-collapse:collapse;margin:24px 0;">
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:600;width:40%;">Service</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${service}</td>
    </tr>
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;font-weight:600;">Date &amp; Time</td>
      <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${time}</td>
    </tr>
    <tr>
      <td style="padding:12px;font-weight:600;">Estimated Cost</td>
      <td style="padding:12px;">${costRange}</td>
    </tr>
  </table>

  <p>
    Need to reschedule or cancel? Call us at
    <a href="tel:${businessPhone}" style="color:#2563eb;">${businessPhone}</a>.
  </p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
  <p style="font-size:12px;color:#9ca3af;">
    ${businessName} · Powered by Blue-Collar Agent
  </p>
</body>
</html>
  `.trim();
}
