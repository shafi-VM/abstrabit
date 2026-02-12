'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeBookmarks(onUpdate: () => void) {
  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Realtime update:', payload)
            onUpdate()
          }
        )
        .subscribe()
    }

    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [onUpdate])
}
