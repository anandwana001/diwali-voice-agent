/** Per-session clock context; independent of the server's local timezone. */
export function getAgentDateContext(now = new Date()): string {
  const date = new Intl.DateTimeFormat('hi-IN', {
    timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(now);
  const time = new Intl.DateTimeFormat('hi-IN', {
    timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(now);
  return `Trusted server clock at conversation start: ${now.toISOString()}. In India (Asia/Kolkata, IST), आज ${date} है। बातचीत शुरू होने का समय ${time} है। Use this date for today's date, weekday, and relative-date questions. Today's date is ordinary calendar information: answer it directly without a festival lookup. This is the session-start clock, not a continuously updated clock. Only festival dates and muhurat require lookup_festival_info. Never confuse today's date with the festival date.`;
}
