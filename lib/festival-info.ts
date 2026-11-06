// Reviewed reference data, not a live Panchang feed. Never extrapolate other dates.
const cities: Record<string, { city: string; start: string; end: string }> = {
  pune: { city: 'Pune', start: '18:24', end: '20:24' },
  mumbai: { city: 'Mumbai', start: '18:27', end: '20:27' },
  delhi: { city: 'New Delhi', start: '17:54', end: '19:50' },
  'new delhi': { city: 'New Delhi', start: '17:54', end: '19:50' },
  bengaluru: { city: 'Bengaluru', start: '18:17', end: '20:20' },
  bangalore: { city: 'Bengaluru', start: '18:17', end: '20:20' },
};
export function lookupFestival(city: string, year: number, festival: string) {
  const entry = cities[city.trim().toLowerCase()];
  if (!entry || year !== 2026 || festival !== 'lakshmi_puja') {
    return { available: false, reason: 'No verified entry for this city, year and festival. Do not infer a timing.', supportedCities: ['Pune', 'Mumbai', 'New Delhi', 'Bengaluru'], supportedYear: 2026 };
  }
  return { available: true, ...entry, festival: 'Lakshmi Puja', date: '2026-11-08', timezone: 'Asia/Kolkata', source: { name: 'Drik Panchang', url: 'https://www.drikpanchang.com/festivals/lakshmipuja/festivals-lakshmipuja-timings.html?geoname-id=1259229&year=2026', verifiedOn: '2026-11-06', access: 'curated_local_dataset', live: false } };
}
