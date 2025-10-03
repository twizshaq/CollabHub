// app/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  if (process.env.NODE_ENV === 'development') {
    // In development, we can safely redirect to the request's origin.
    // This allows you to access your local server from your mobile phone.
    return NextResponse.redirect(`${requestUrl.origin}/profile`);
  } else {
    // In production, we should always redirect to the canonical site URL.
    // This prevents users from being redirected to a Vercel preview URL.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    return NextResponse.redirect(`${siteUrl}/profile`);
  }
}