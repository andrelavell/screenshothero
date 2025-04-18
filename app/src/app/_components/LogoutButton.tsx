'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
    } else {
      // Refresh the page or navigate to ensure session state is cleared
      router.push('/auth') // Redirect to login page after logout
      router.refresh() // Ensure server components re-evaluate
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm hover:bg-cyan-600"
    >
      Logout
    </button>
  )
}
