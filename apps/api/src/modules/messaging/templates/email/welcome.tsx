import * as React from 'react';

interface WelcomeEmailProps {
  ownerName: string | null;
  businessName: string;
  dashboardUrl: string;
}

export function renderWelcomeEmail(props: WelcomeEmailProps): string {
  const { ownerName, businessName, dashboardUrl } = props;
  const name = ownerName ?? 'there';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Welcome to Blue-Collar Agent!</title>
</head>
<body style="font-family:sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#2563eb;">Welcome to Blue-Collar Agent!</h1>

  <p>Hi ${name},</p>
  <p>
    Congratulations — <strong>${businessName}</strong> is now set up with your AI voice
    receptionist. Your phone will never go unanswered again.
  </p>

  <h2 style="font-size:18px;">What happens next:</h2>
  <ol>
    <li>Complete your onboarding in the dashboard (5 minutes)</li>
    <li>We'll assign you a Twilio phone number</li>
    <li>Forward your business line to it — and you're live!</li>
  </ol>

  <p>
    <a href="${dashboardUrl}"
       style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
      Open Dashboard
    </a>
  </p>

  <p>
    Questions? Reply to this email or check out our quick-start guide in the dashboard.
  </p>

  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
  <p style="font-size:12px;color:#9ca3af;">Blue-Collar Agent — AI Receptionist for Trades</p>
</body>
</html>
  `.trim();
}
