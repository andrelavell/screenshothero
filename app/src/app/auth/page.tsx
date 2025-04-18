'use client'

import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check for error parameter in URL
    const error = searchParams.get('error')
    if (error) {
      setErrorMessage('Authentication error occurred. Please try again.')
    }
  }, [searchParams])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is logged in, redirect to home or dashboard
        router.push('/') // Adjust the redirect path if needed
      }
    })

    // Check initial session state on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/') // Adjust if already logged in
      }
    });

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // Add or remove providers as needed
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`} // Ensure this matches Supabase settings
        />
      </div>
    </div>
  )
}
