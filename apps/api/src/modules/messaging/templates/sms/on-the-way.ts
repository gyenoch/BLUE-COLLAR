interface OnTheWaySmsOpts {
  customerName: string | null;
  technicianName: string;
  businessName: string;
  etaMinutes: number;
  language?: string;
}

export function buildOnTheWaySms(opts: OnTheWaySmsOpts): string {
  const { customerName, technicianName, businessName, etaMinutes, language } = opts;
  const name = customerName ? `, ${customerName.split(' ')[0]}` : '';
  const eta = etaMinutes <= 5 ? 'a few minutes' : `about ${etaMinutes} minutes`;
  const etaEs = etaMinutes <= 5 ? 'unos minutos' : `unos ${etaMinutes} minutos`;

  if (language === 'es') {
    return (
      `¡${technicianName} de ${businessName} ya va en camino${name}! ` +
      `Llegará en ${etaEs}. ¡Nos vemos pronto!`
    );
  }

  return (
    `${technicianName} from ${businessName} is on the way${name}! ` +
    `ETA: ${eta}. See you soon!`
  );
}
