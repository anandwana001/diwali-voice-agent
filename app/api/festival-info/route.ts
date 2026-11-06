import { NextRequest, NextResponse } from 'next/server';
import { lookupFestival } from '@/lib/festival-info';
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const city = params.get('city') ?? '';
  const year = Number(params.get('year'));
  const festival = params.get('festival') ?? '';
  if (!city.trim() || city.length > 80 || !Number.isInteger(year) || year < 1900 || year > 2200 || !festival || festival.length > 50) {
    return NextResponse.json({ error: 'Provide city, year (1900–2200), and festival.' }, { status: 400 });
  }
  return NextResponse.json(lookupFestival(city, year, festival));
}
