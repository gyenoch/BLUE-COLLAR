import { formatAppointmentTime } from '../../../../utils/helpers';

interface ReminderSmsOpts {
  customerName: string | null;
  businessName: string;
  businessPhone: string;
  scheduledTime: Date;
  timezone: string;
  language?: string;
}

export function buildReminderSms(opts: ReminderSmsOpts): string {
  const { customerName, businessName, businessPhone, scheduledTime, timezone, language } = opts;
  const name = customerName ? `, ${customerName.split(' ')[0]}` : '';
  const time = formatAppointmentTime(scheduledTime, timezone);

  if (language === 'es') {
    return (
      `Recordatorio${name}: ${businessName} llegará mañana ${time}. ` +
      `Responde C para confirmar o llama al ${businessPhone} para reagendar.`
    );
  }

  return (
    `Reminder${name}: ${businessName} is coming tomorrow ${time}. ` +
    `Reply C to confirm or call ${businessPhone} to reschedule.`
  );
}
