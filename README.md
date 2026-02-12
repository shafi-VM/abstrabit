# Smart Bookmark App

A full-stack bookmark management application built for the Abstrabit job application micro-challenge. Features Google OAuth authentication, real-time multi-tab synchronization, and private bookmark management.

## 🚀 Live Demo

**Live URL:** [To be added after deployment]

## ✨ Features

- **Google OAuth Authentication** - Secure sign-in with Google (no email/password)
- **Private Bookmarks** - Each user's bookmarks are completely private with Row Level Security (RLS)
- **Real-time Synchronization** - Changes sync instantly across all open tabs
- **Add/Delete Bookmarks** - Simple interface to manage your favorite links
- **URL Validation** - Ensures only valid URLs are saved
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Clean interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with Google OAuth
- **Real-time:** Supabase Realtime (WebSockets)
- **Deployment:** Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Google Cloud Console account
- Git installed

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/abstrabit.git
cd abstrabit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration script from `supabase-migration.sql`
3. Enable Realtime:
   - Navigate to **Database → Replication**
   - Find the `bookmarks` table
   - Enable replication for the table
4. Get your project credentials:
   - Go to **Settings → API**
   - Copy the `Project URL` and `anon public` key

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → OAuth consent screen**
   - Choose "External" user type
   - Fill in app name and support email
   - Save and continue
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: Web application
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://YOUR_VERCEL_URL.vercel.app` (after deployment)
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
     - `https://YOUR_VERCEL_URL.vercel.app/auth/callback` (after deployment)
   - Save and copy the **Client ID** and **Client Secret**

5. Configure Supabase Auth:
   - In Supabase Dashboard: **Authentication → Providers → Google**
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace with your actual Supabase credentials from step 3.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Bookmarks Table

| Column       | Type                     | Description                    |
|--------------|--------------------------|--------------------------------|
| `id`         | `uuid` (PK)              | Unique bookmark identifier     |
| `user_id`    | `uuid` (FK)              | References auth.users(id)      |
| `url`        | `text`                   | The bookmark URL               |
| `title`      | `text`                   | The bookmark title             |
| `created_at` | `timestamp with tz`      | Creation timestamp             |
| `updated_at` | `timestamp with tz`      | Last update timestamp          |

### Row Level Security (RLS) Policies

1. **SELECT:** Users can only view their own bookmarks (`user_id = auth.uid()`)
2. **INSERT:** Users can only create bookmarks for themselves
3. **DELETE:** Users can only delete their own bookmarks

### Indexes

- `bookmarks_user_id_idx` on `user_id` - Fast user-specific queries
- `bookmarks_created_at_idx` on `created_at DESC` - Efficient sorting

## 🐛 Problems & Solutions

### 1. OAuth Redirect URI Mismatch

**Problem:** Getting `redirect_uri_mismatch` error during Google sign-in.

**Solution:**
- Ensured exact match between Google Cloud Console redirect URIs and Supabase callback URL
- Added all required redirect URIs (localhost, Supabase, production)
- Verified no trailing slashes or typos
- Used the correct Supabase project reference in the callback URL

### 2. Real-time Subscription Not Working

**Problem:** Changes in one tab not appearing in other tabs.

**Solution:**
- Enabled Realtime replication for the `bookmarks` table in Supabase Dashboard (Database → Replication)
- Added user-specific filter to subscription: `filter: user_id=eq.${user.id}`
- Used `useCallback` to memoize the refresh callback and prevent subscription recreation
- Properly cleaned up subscriptions in `useEffect` cleanup function to prevent memory leaks

### 3. RLS Policy Testing

**Problem:** Uncertain if RLS policies were working correctly.

**Solution:**
- Created bookmarks with one Google account
- Signed out and signed in with a different Google account
- Verified the second user couldn't see the first user's bookmarks
- Tested in Supabase SQL Editor with different `auth.uid()` values

### 4. Multi-tab Synchronization Delays

**Problem:** Real-time updates sometimes had slight delays.

**Solution:**
- Used PostgreSQL change events (`postgres_changes`) instead of polling
- Subscribed to all events (`event: '*'`) to capture INSERT, UPDATE, DELETE
- Called `refresh()` immediately on receiving any change event
- Ensured proper WebSocket connection via Supabase Realtime

### 5. TypeScript Type Generation

**Problem:** Needed accurate TypeScript types for database schema.

**Solution:**
- Initially created manual types based on schema
- For production, would use: `npx supabase gen types typescript --project-id YOUR_PROJECT_REF`
- Regenerate types after any schema changes
- Imported `Database` type in all Supabase client files

### 6. Cookie Handling for SSR

**Problem:** Session not persisting across Server Components and API routes.

**Solution:**
- Used `@supabase/ssr` package instead of deprecated `@supabase/auth-helpers-nextjs`
- Implemented proper cookie handling in server-side client with `cookies()` from Next.js
- Created middleware to refresh sessions on every request
- Used separate client/server Supabase clients with appropriate cookie handling

### 7. Middleware Matcher Configuration

**Problem:** Middleware running on static files causing performance issues.

**Solution:**
- Configured matcher to exclude `_next/static`, `_next/image`, `favicon.ico`
- Used regex pattern to exclude image files (svg, png, jpg, etc.)
- Protected only necessary routes while allowing public assets

### 8. Form Validation

**Problem:** Users could submit invalid URLs.

**Solution:**
- Implemented URL validation using JavaScript's `URL` constructor
- Added client-side validation before submission
- Displayed user-friendly error messages
- Used HTML5 `type="url"` for native browser validation as a backup

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page with sign-in
│   ├── auth/
│   │   ├── callback/route.ts      # OAuth callback handler
│   │   └── signout/route.ts       # Sign-out route
│   └── dashboard/
│       ├── layout.tsx             # Protected route wrapper
│       └── page.tsx               # Main dashboard
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx       # Google OAuth sign-in
│   │   └── SignOutButton.tsx      # Sign-out button
│   ├── bookmarks/
│   │   ├── AddBookmarkForm.tsx    # Form to add bookmarks
│   │   ├── BookmarkList.tsx       # List of bookmarks
│   │   └── BookmarkItem.tsx       # Individual bookmark card
│   └── ui/
│       ├── Button.tsx             # Reusable button component
│       ├── Input.tsx              # Reusable input component
│       └── Card.tsx               # Reusable card component
├── hooks/
│   ├── useBookmarks.ts            # Bookmark CRUD operations
│   └── useRealtimeBookmarks.ts    # Real-time subscription hook
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Client-side Supabase client
│   │   └── server.ts              # Server-side Supabase client
│   ├── types/database.types.ts    # TypeScript database types
│   └── utils.ts                   # Utility functions (cn)
└── middleware.ts                  # Session refresh middleware
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Smart Bookmark App"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy

3. **Update Google OAuth:**
   - Add Vercel URL to authorized origins and redirect URIs in Google Cloud Console
   - Update redirect URIs in Supabase Auth settings if needed

4. **Test Production:**
   - Visit your Vercel URL
   - Test Google sign-in
   - Create and delete bookmarks
   - Test real-time sync across multiple tabs

## 🧪 Testing Checklist

- [x] Google OAuth sign-in redirects to dashboard
- [x] Sign-out redirects to home page
- [x] Cannot access `/dashboard` when logged out
- [x] Can add bookmark with valid URL
- [x] Invalid URL shows error message
- [x] Can delete bookmark
- [x] Bookmarks sorted by newest first
- [x] Real-time sync: Add in tab 1 → appears in tab 2
- [x] Real-time sync: Delete in tab 1 → disappears in tab 2
- [x] Privacy: User A cannot see User B's bookmarks
- [x] RLS policies enforced at database level

## 📝 Future Enhancements

- Bookmark editing functionality
- Bookmark categories/tags
- Search and filter bookmarks
- Bookmark import/export
- Bookmark sharing
- Browser extension
- Bookmark previews with Open Graph metadata

## 🤝 Contributing

This is a micro-challenge project for Abstrabit job application. Not accepting contributions at this time.

## 📄 License

This project is created for educational and demonstration purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

Built with ❤️ for Abstrabit | Time: 72 hours
