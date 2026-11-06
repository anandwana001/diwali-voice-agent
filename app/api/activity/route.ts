import { NextRequest, NextResponse } from 'next/server';
import { getActivity, setActivity, verifyActivityTicket } from '@/lib/activity';
function authorized(request: NextRequest) {
  return verifyActivityTicket(request.nextUrl.searchParams.get('channel') ?? '', request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '');
}
export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(getActivity(request.nextUrl.searchParams.get('channel')!) ?? {}, { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (body?.activity !== 'rangoli' && body?.activity !== 'puja') return NextResponse.json({error:'Unsupported activity'}, {status:400});
  setActivity(request.nextUrl.searchParams.get('channel')!, body.activity);
  return NextResponse.json({ displayed: true, activity: body.activity, instruction: 'The visual activity has been requested. Briefly tell the user in Hindi to look at the screen. Do not read the entire guide aloud.' });
}
