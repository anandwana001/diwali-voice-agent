import { createHmac, timingSafeEqual } from 'node:crypto';
export type Activity = 'rangoli' | 'puja';
type Entry = { activity: Activity; updatedAt: number };
const globalStore = globalThis as typeof globalThis & { diwaliActivities?: Map<string, Entry> };
const store = globalStore.diwaliActivities ??= new Map<string, Entry>();
export function activityTicket(channel: string) {
  const expires = Date.now() + 60 * 60 * 1000;
  const signature = createHmac('sha256', process.env.NEXT_AGORA_APP_CERTIFICATE!).update(`${channel}:${expires}`).digest('hex');
  return `${expires}.${signature}`;
}
export function verifyActivityTicket(channel: string, ticket: string) {
  const [expires, signature] = ticket.split('.');
  if (!channel || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  const expected = createHmac('sha256', process.env.NEXT_AGORA_APP_CERTIFICATE!).update(`${channel}:${expires}`).digest('hex');
  const received = Buffer.from(signature);
  return received.length === expected.length && timingSafeEqual(received, Buffer.from(expected));
}
export function setActivity(channel: string, activity: Activity) {
  for (const [key, value] of store) if (Date.now() - value.updatedAt > 3600000) store.delete(key);
  store.set(channel, { activity, updatedAt: Date.now() });
}
export function getActivity(channel: string) { return store.get(channel) ?? null; }
