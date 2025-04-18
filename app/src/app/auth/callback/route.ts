import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'
  const origin = requestUrl.origin

  // Create a response early so we can modify its cookies
  const response = new NextResponse()

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete(name)
        },
      },
    }
  )

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Copy cookies to the redirect response
      const redirectResponse = NextResponse.redirect(`${origin}${next}`)
      response.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie)
      })
      return redirectResponse
    }
    console.error('[Auth Callback] Error exchanging code for session:', error.message)
  } else {
    console.error('[Auth Callback] No code found in search params.')
  }

  // Copy cookies to the error redirect response
  const errorResponse = NextResponse.redirect(`${origin}/auth?error=auth_callback_error`)
  response.cookies.getAll().forEach(cookie => {
    errorResponse.cookies.set(cookie)
  })
  return errorResponse
}
