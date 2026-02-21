import { formatAppointmentTime } from '../../../../utils/helpers';

interface ConfirmationSmsOpts {
  customerName: string | null;
  businessName: string;
  scheduledTime: Date;
  serviceType: string | null;
  timezone: string;
  language?: string;
}

export function buildConfirmationSms(opts: ConfirmationSmsOpts): string {
  const { customerName, businessName, scheduledTime, serviceType, timezone, language } = opts;
  const name = customerName ? `, ${customerName.split(' ')[0]}` : '';
  const time = formatAppointmentTime(scheduledTime, timezone);
  const service = serviceType ? ` for ${serviceType}` : '';

  if (language === 'es') {
    return (
      `¡Confirmado${name}! ${businessName} tiene una cita programada${service} ` +
      `el ${time}. ` +
      `Para reagendar o cancelar, llámenos directamente. ¡Hasta pronto!`
    );
  }

  return (
    `Confirmed${name}! ${businessName} has you scheduled${service} ` +
    `on ${time}. ` +
    `To reschedule or cancel, just call us. See you then!`
  );
}
