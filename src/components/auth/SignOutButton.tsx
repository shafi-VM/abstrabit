'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'

export function SignOutButton() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setShowConfirm(true)} variant="outline">
        Sign Out
      </Button>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSignOut}
        title="Sign Out?"
        message="Are you sure you want to sign out? You'll need to sign in again to access your bookmarks."
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  )
}
