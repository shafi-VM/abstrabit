'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/Modal'
import { Database } from '@/lib/types/database.types'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

interface BookmarkItemProps {
  bookmark: Bookmark
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, url: string, title: string) => Promise<void>
  onToast: (message: string, type: 'success' | 'error') => void
}

export function BookmarkItem({ bookmark, onDelete, onUpdate, onToast }: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editUrl, setEditUrl] = useState(bookmark.url)
  const [editTitle, setEditTitle] = useState(bookmark.title)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Format date to relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return url
    }
  }

  // Get favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
    } catch {
      return null
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      onToast('URL copied to clipboard!', 'success')
    } catch {
      onToast('Failed to copy URL', 'error')
    }
  }

  const handleSaveEdit = async () => {
    if (!editUrl.trim() || !editTitle.trim()) {
      onToast('URL and title are required', 'error')
      return
    }

    try {
      setLoading(true)
      await onUpdate(bookmark.id, editUrl, editTitle)
      setIsEditing(false)
      onToast('Bookmark updated successfully!', 'success')
    } catch {
      onToast('Failed to update bookmark', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditUrl(bookmark.url)
    setEditTitle(bookmark.title)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await onDelete(bookmark.id)
      onToast('Bookmark deleted successfully!', 'success')
    } catch {
      onToast('Failed to delete bookmark', 'error')
    }
  }

  const faviconUrl = getFaviconUrl(bookmark.url)

  if (isEditing) {
    return (
      <>
        <Card className="p-4 border-amber-500/30 bg-slate-800/70 shadow-xl shadow-black/50">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">URL</label>
            <Input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveEdit} disabled={loading} size="sm">
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancelEdit} variant="outline" size="sm" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
      </>
    )
  }

  return (
    <>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Bookmark?"
        message={`Are you sure you want to delete "${bookmark.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    <Card className="p-5 hover:shadow-2xl transition-all hover:border-amber-500/40 hover:scale-[1.01] group bg-slate-800/40 backdrop-blur-sm shadow-xl shadow-black/30 border-amber-500/10">
      <div className="flex items-start gap-4">
        {/* Favicon */}
        {faviconUrl && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-md">
            <img
              src={faviconUrl}
              alt=""
              className="w-6 h-6 rounded"
              onError={(e) => {
                e.currentTarget.parentElement!.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-amber-50 truncate mb-1">
            {bookmark.title}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-400 hover:text-amber-300 hover:underline truncate block mb-2 flex items-center gap-1"
          >
            {getDomain(bookmark.url)}
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <p className="text-xs text-gray-500">{getRelativeTime(bookmark.created_at)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopyUrl}
            className="p-2 hover:bg-emerald-500/20 rounded transition-all cursor-pointer"
            title="Copy URL"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-amber-500/20 rounded transition-all cursor-pointer"
            title="Edit"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 hover:bg-rose-500/20 rounded transition-all cursor-pointer"
            title="Delete"
          >
            <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
    </>
  )
}
