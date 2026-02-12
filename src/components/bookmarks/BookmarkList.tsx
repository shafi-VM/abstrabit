'use client'

import { useState, useMemo } from 'react'
import { BookmarkItem } from './BookmarkItem'
import { Input } from '@/components/ui/Input'
import { Database } from '@/lib/types/database.types'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, url: string, title: string) => Promise<void>
  onToast: (message: string, type: 'success' | 'error') => void
  loading: boolean
  loadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

export function BookmarkList({
  bookmarks,
  onDelete,
  onUpdate,
  onToast,
  loading,
  loadingMore = false,
  hasMore = false,
  onLoadMore
}: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter bookmarks based on search query
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks

    const query = searchQuery.toLowerCase()
    return bookmarks.filter((bookmark) => {
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      )
    })
  }, [bookmarks, searchQuery])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Loading bookmarks...</p>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/30 rounded border-2 border-dashed border-amber-500/20 shadow-xl shadow-black/30">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-amber-50">No bookmarks yet</h3>
        <p className="mt-2 text-sm text-gray-400">
          Get started by adding your first bookmark above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-amber-50 tracking-tight">
          Your Bookmarks ({filteredBookmarks.length})
        </h2>

        {/* Search bar */}
        {bookmarks.length > 0 && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-8 bg-slate-800/30 rounded border border-amber-500/10 shadow-xl shadow-black/30">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-400">
            No bookmarks found matching "<span className="text-amber-400">{searchQuery}</span>"
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onToast={onToast}
              />
            ))}
          </div>

          {/* Load More Button */}
          {!searchQuery && hasMore && onLoadMore && (
            <div className="mt-6 text-center">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-gray-900 rounded font-semibold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Load More
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
