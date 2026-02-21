import * as React from 'react';
import { formatAppointmentTime } from '../../../../utils/helpers';

interface ReminderEmailProps {
  customerName: string | null;
  businessName: string;
  businessPhone: string;
  scheduledTime: Date;
  serviceType: string | null;
  timezone: string;
}

export function renderReminderEmail(props: ReminderEmailProps): string {
  const { customerName, businessName, businessPhone, scheduledTime, serviceType, timezone } = props;
  const name = customerName ?? 'there';
  const time = formatAppointmentTime(scheduledTime, timezone);
  const service = serviceType ?? 'your service visit';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Appointment Reminder — ${businessName}</title>
</head>
<body style="font-family:sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#d97706;margin-bottom:4px;">Appointment Reminder</h1>
  <p style="color:#6b7280;margin-top:0;">from ${businessName}</p>

  <p>Hi ${name},</p>
  <p>
    This is a friendly reminder that <strong>${businessName}</strong> is scheduled for
    <strong>${service}</strong> tomorrow at <strong>${time}</strong>.
  </p>

  <p>
    Please make sure someone is home and the work area is accessible.
  </p>

  <p>
    Need to reschedule? Call us at
    <a href="tel:${businessPhone}" style="color:#2563eb;">${businessPhone}</a>
    as soon as possible.
  </p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
  <p style="font-size:12px;color:#9ca3af;">
    ${businessName} · Powered by Blue-Collar Agent
  </p>
</body>
</html>
  `.trim();
}
