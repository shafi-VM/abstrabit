'use client'

import { useCallback } from 'react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useRealtimeBookmarks } from '@/hooks/useRealtimeBookmarks'
import { useToast } from '@/hooks/useToast'
import { AddBookmarkForm } from '@/components/bookmarks/AddBookmarkForm'
import { BookmarkList } from '@/components/bookmarks/BookmarkList'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { ToastContainer } from '@/components/ui/Toast'

export default function DashboardPage() {
  const {
    bookmarks,
    loading,
    loadingMore,
    hasMore,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    loadMore,
    refresh
  } = useBookmarks()
  const { toasts, showToast, removeToast } = useToast()

  // Memoize the refresh callback to prevent unnecessary re-renders
  const handleRealtimeUpdate = useCallback(() => {
    refresh()
  }, [refresh])

  // Set up real-time subscription
  useRealtimeBookmarks(handleRealtimeUpdate)

  return (
    <div className="min-h-screen bg-[#010101]">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <header className="bg-[#010101] border-b-2 border-[#202020] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#09f] rounded-2xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">My Bookmarks</h1>
                <p className="text-sm text-[#a6a6a6]">Save and organize your favorite links</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Bookmark Form - Sticky on large screens */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <AddBookmarkForm onAdd={addBookmark} onToast={showToast} />

              {/* Quick Stats */}
              <div className="mt-6 bg-[#151515] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a6a6a6]">Total Bookmarks</span>
                    <span className="font-bold text-white">{bookmarks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a6a6a6]">Added Today</span>
                    <span className="font-bold text-white">
                      {bookmarks.filter((b) => {
                        const today = new Date().setHours(0, 0, 0, 0)
                        const bookmarkDate = new Date(b.created_at).setHours(0, 0, 0, 0)
                        return bookmarkDate === today
                      }).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 bg-[#151515] rounded-3xl p-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pro Tips
                </h3>
                <ul className="text-xs text-[#a6a6a6] space-y-1.5">
                  <li>• Hover over bookmarks to see actions</li>
                  <li>• Use search to filter bookmarks</li>
                  <li>• Click domain to open in new tab</li>
                  <li>• Copy icon copies URL to clipboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bookmark List */}
          <div className="lg:col-span-2">
            <BookmarkList
              bookmarks={bookmarks}
              onDelete={deleteBookmark}
              onUpdate={updateBookmark}
              onToast={showToast}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
