'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface AddBookmarkFormProps {
  onAdd: (url: string, title: string) => Promise<void>
  onToast: (message: string, type: 'success' | 'error') => void
}

export function AddBookmarkForm({ onAdd, onToast }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedUrl = url.trim()
    const trimmedTitle = title.trim()

    if (!trimmedUrl || !trimmedTitle) {
      setError('Both URL and title are required')
      return
    }

    if (trimmedTitle.length > 200) {
      setError('Title is too long (max 200 characters)')
      return
    }

    if (trimmedUrl.length > 2000) {
      setError('URL is too long')
      return
    }

    try {
      setLoading(true)
      await onAdd(url, title)
      setUrl('')
      setTitle('')
      onToast('Bookmark added successfully!', 'success')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add bookmark'
      setError(errorMsg)
      onToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-[#151515] rounded-3xl border-0">
      <h2 className="text-xl font-black text-white mb-6">Add New Bookmark</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-white mb-2">
            URL
          </label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            maxLength={2000}
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="My Awesome Website"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={200}
          />
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Adding...' : 'Add Bookmark'}
        </Button>
      </form>
    </Card>
  )
}
