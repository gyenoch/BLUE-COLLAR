/**
 * Reference data seed — no actual table needed in MVP.
 * Keep as a lookup reference for future geo-targeting features.
 */
export const TARGET_CITIES = [
  // Texas
  { city: 'Houston',      state: 'TX', tz: 'America/Chicago' },
  { city: 'Dallas',       state: 'TX', tz: 'America/Chicago' },
  { city: 'San Antonio',  state: 'TX', tz: 'America/Chicago' },
  { city: 'Austin',       state: 'TX', tz: 'America/Chicago' },

  // Florida
  { city: 'Miami',        state: 'FL', tz: 'America/New_York' },
  { city: 'Orlando',      state: 'FL', tz: 'America/New_York' },
  { city: 'Tampa',        state: 'FL', tz: 'America/New_York' },
  { city: 'Jacksonville', state: 'FL', tz: 'America/New_York' },

  // California
  { city: 'Los Angeles',  state: 'CA', tz: 'America/Los_Angeles' },
  { city: 'San Diego',    state: 'CA', tz: 'America/Los_Angeles' },
  { city: 'San Jose',     state: 'CA', tz: 'America/Los_Angeles' },
  { city: 'Sacramento',   state: 'CA', tz: 'America/Los_Angeles' },

  // Arizona
  { city: 'Phoenix',      state: 'AZ', tz: 'America/Phoenix' },
  { city: 'Tucson',       state: 'AZ', tz: 'America/Phoenix' },
  { city: 'Scottsdale',   state: 'AZ', tz: 'America/Phoenix' },
];
