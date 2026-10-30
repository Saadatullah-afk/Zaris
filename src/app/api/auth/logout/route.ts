import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/auth';

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
