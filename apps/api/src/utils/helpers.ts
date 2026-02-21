/** Normalize any US phone to E.164 format: +12145551234 */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

/** Display-friendly: (214) 555-1234 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^1/, '');
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Format appointment time for SMS: "Tuesday, March 4 at 2:00 PM" */
export function formatAppointmentTime(date: Date, timezone = 'America/New_York'): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/** Sleep N ms */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Truncate string with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/** Safe JSON parse with fallback */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/** Simple Spanish language detector */
export function detectSpanish(text: string): boolean {
  const markers = [
    'hola', 'necesito', 'ayuda', 'agua', 'calor', 'frio', 'casa',
    'plomero', 'urgente', 'gracias', 'por favor', 'quiero', 'tengo',
    'problema', 'roto', 'llama',
  ];
  const lower = text.toLowerCase();
  return markers.some((w) => lower.includes(w));
}

/** Chunk array into subarrays of size n */
export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
