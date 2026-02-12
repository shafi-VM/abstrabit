'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database.types'
import { normalizeUrl, isSameUrl } from '@/lib/urlUtils'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

const BOOKMARKS_PER_PAGE = 20

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const supabase = createClient()

  const fetchBookmarks = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(0)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const currentPage = reset ? 0 : page
      const from = currentPage * BOOKMARKS_PER_PAGE
      const to = from + BOOKMARKS_PER_PAGE - 1

      const { data, error: fetchError, count } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (fetchError) {
        throw fetchError
      }

      if (reset) {
        setBookmarks(data || [])
      } else {
        setBookmarks((prev) => [...prev, ...(data || [])])
      }

      // Check if there are more bookmarks to load
      const totalLoaded = reset ? (data?.length || 0) : bookmarks.length + (data?.length || 0)
      setHasMore(totalLoaded < (count || 0))

      if (!reset) {
        setPage((p) => p + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [supabase, page, bookmarks.length])

  const addBookmark = async (url: string, title: string) => {
    try {
      setError(null)

      // Validation
      const trimmedUrl = url.trim()
      const trimmedTitle = title.trim()

      if (!trimmedUrl || !trimmedTitle) {
        throw new Error('URL and title are required')
      }

      if (trimmedTitle.length > 200) {
        throw new Error('Title is too long (max 200 characters)')
      }

      if (trimmedUrl.length > 2000) {
        throw new Error('URL is too long (max 2000 characters)')
      }

      // Check for duplicate URLs
      const normalizedNewUrl = normalizeUrl(trimmedUrl)
      const duplicate = bookmarks.find((bookmark) =>
        isSameUrl(bookmark.url, trimmedUrl)
      )

      if (duplicate) {
        throw new Error('This URL is already bookmarked')
      }

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          url: trimmedUrl,
          title: trimmedTitle,
        })

      if (insertError) {
        throw insertError
      }

      await fetchBookmarks(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark')
      throw err
    }
  }

  const updateBookmark = async (id: string, url: string, title: string) => {
    try {
      setError(null)

      // Validation
      const trimmedUrl = url.trim()
      const trimmedTitle = title.trim()

      if (!trimmedUrl || !trimmedTitle) {
        throw new Error('URL and title are required')
      }

      if (trimmedTitle.length > 200) {
        throw new Error('Title is too long (max 200 characters)')
      }

      if (trimmedUrl.length > 2000) {
        throw new Error('URL is too long (max 2000 characters)')
      }

      // Check for duplicate URLs (excluding current bookmark)
      const duplicate = bookmarks.find((bookmark) =>
        bookmark.id !== id && isSameUrl(bookmark.url, trimmedUrl)
      )

      if (duplicate) {
        throw new Error('This URL is already bookmarked')
      }

      const { error: updateError } = await supabase
        .from('bookmarks')
        .update({ url: trimmedUrl, title: trimmedTitle })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      await fetchBookmarks(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bookmark')
      throw err
    }
  }

  const deleteBookmark = async (id: string) => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      await fetchBookmarks(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bookmark')
      throw err
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchBookmarks(false)
    }
  }, [loadingMore, hasMore, fetchBookmarks])

  useEffect(() => {
    fetchBookmarks(true)
  }, []) // Only run once on mount

  return {
    bookmarks,
    loading,
    loadingMore,
    error,
    hasMore,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    loadMore,
    refresh: () => fetchBookmarks(true),
  }
}
