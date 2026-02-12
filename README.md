# Smart Bookmark App

A production-ready, full-stack bookmark management application with Google OAuth authentication, real-time multi-tab synchronization, advanced search, and a minimalist high-contrast UI.

## 🚀 Live Demo

**Live URL:** [To be added after deployment]

## ✨ Features

### Core Functionality
- **Google OAuth Authentication** - Secure sign-in with Google (no email/password)
- **Private Bookmarks** - Each user's bookmarks are completely private with Row Level Security (RLS)
- **Real-time Synchronization** - Changes sync instantly across all open tabs using WebSockets
- **Full CRUD Operations** - Add, edit, delete bookmarks with validation
- **Smart Search** - Real-time search across bookmark titles and URLs
- **Pagination** - Load bookmarks in batches of 20 with "Load More" functionality

### Advanced Features
- **Duplicate Detection** - Smart URL normalization prevents duplicate bookmarks
  - Handles www/non-www variants
  - Case-insensitive matching
  - Protocol normalization (http/https)
  - Trailing slash handling
- **URL Validation** - Comprehensive validation with length limits and format checks
- **Toast Notifications** - Beautiful success/error messages with auto-dismiss
- **Custom Modals** - Elegant confirmation dialogs replacing browser defaults
- **Favicon Display** - Shows website icons for visual recognition
- **Relative Timestamps** - "Just now", "5m ago", "2h ago" for better UX
- **Copy to Clipboard** - One-click URL copying
- **Quick Stats** - Real-time bookmark counts and analytics

### UI/UX
- **Minimalist Design** - High-contrast black (#010101) background inspired by edwinle.com
- **Bright Cyan Accents** - (#09f) for interactive elements and links
- **Bold Typography** - Clean, modern fonts with strong hierarchy
- **Generous Spacing** - Breathing room with 24px rounded corners
- **Smooth Animations** - Polished transitions and hover effects
- **Responsive Design** - Works seamlessly on all devices
- **Keyboard Accessible** - Full keyboard navigation support

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS (Custom design system)
- **Backend:** Supabase (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth with Google OAuth 2.0
- **Real-time:** Supabase Realtime (WebSocket-based subscriptions)
- **Deployment:** Vercel (Edge Network)
- **Type Safety:** Full TypeScript with auto-generated database types

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier works perfectly)
- A Google Cloud Console account
- Git installed

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shafi-VM/abstrabit.git
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
   - Toggle replication **ON**
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
| `url`        | `text`                   | The bookmark URL (max 2000)    |
| `title`      | `text`                   | The bookmark title (max 200)   |
| `created_at` | `timestamp with tz`      | Creation timestamp             |
| `updated_at` | `timestamp with tz`      | Auto-updated on changes        |

### Row Level Security (RLS) Policies

1. **SELECT:** Users can only view their own bookmarks (`user_id = auth.uid()`)
2. **INSERT:** Users can only create bookmarks for themselves
3. **UPDATE:** Users can only update their own bookmarks
4. **DELETE:** Users can only delete their own bookmarks

### Indexes

- `bookmarks_user_id_idx` on `user_id` - Fast user-specific queries
- `bookmarks_created_at_idx` on `created_at DESC` - Efficient sorting

### Triggers

- `update_bookmarks_updated_at` - Automatically updates `updated_at` timestamp

## 🐛 Problems & Solutions

### 1. Duplicate URL Prevention

**Problem:** Users could add the same URL multiple times with slight variations (www, http/https, trailing slashes).

**Solution:**
- Created URL normalization utility in `src/lib/urlUtils.ts`
- Normalizes URLs by: removing www prefix, standardizing protocol, removing trailing slashes
- Checks for duplicates before INSERT and UPDATE operations
- Provides clear error message: "This URL is already bookmarked"

### 2. Pagination Performance

**Problem:** Loading all bookmarks at once could be slow with hundreds of bookmarks.

**Solution:**
- Implemented pagination with 20 bookmarks per page
- Used Supabase `.range()` for efficient server-side pagination
- Added "Load More" button with loading states
- Tracks `hasMore` flag to hide button when all bookmarks loaded
- Resets to page 1 after add/edit/delete operations

### 3. Real-time Subscription Memory Leaks

**Problem:** Real-time subscriptions not being cleaned up properly.

**Solution:**
- Used `useCallback` to memoize refresh callback
- Proper cleanup in `useEffect` return function
- Added user-specific filter: `filter: user_id=eq.${user.id}`
- Removed channel on component unmount

### 4. Browser Default Confirm Dialog

**Problem:** Native browser `confirm()` dialog looked outdated and inconsistent with modern UI.

**Solution:**
- Built custom `ConfirmDialog` component with Modal system
- Styled to match app's minimalist design
- Smooth animations (fade-in backdrop, scale-in modal)
- Accessible with keyboard support
- Prevents body scroll when open

### 5. Text Contrast Issues

**Problem:** Initial pastel colors had poor contrast and were hard to read.

**Solution:**
- Switched to high-contrast minimalist design
- Pure black (#010101) backgrounds
- Pure white (#fff) text for primary content
- Bright cyan (#09f) for interactive elements
- Exceeds WCAG AAA accessibility standards

### 6. Form Validation Edge Cases

**Problem:** Users could submit invalid data (empty strings, very long URLs, special characters).

**Solution:**
- Added comprehensive validation at multiple levels:
  - Client-side validation with immediate feedback
  - HTML5 validation attributes (maxLength, type="url")
  - Server-side validation in hooks
  - Length limits: 200 chars for title, 2000 for URL
  - Trimming whitespace before processing

### 7. OAuth Redirect URI Mismatch

**Problem:** Getting `redirect_uri_mismatch` error during Google sign-in.

**Solution:**
- Ensured exact match between Google Cloud Console redirect URIs and Supabase callback URL
- Added all required redirect URIs (localhost, Supabase, production)
- Verified no trailing slashes or typos
- Used the correct Supabase project reference in the callback URL

### 8. Cookie Handling for SSR

**Problem:** Session not persisting across Server Components and API routes.

**Solution:**
- Used `@supabase/ssr` package instead of deprecated `@supabase/auth-helpers-nextjs`
- Implemented proper cookie handling in server-side client with `cookies()` from Next.js
- Created middleware to refresh sessions on every request
- Used separate client/server Supabase clients with appropriate cookie handling

## 🎨 Design System

### Color Palette
- **Background:** `#010101` (Pure black)
- **Cards:** `#151515` (Dark gray)
- **Borders:** `#202020` (Darker gray)
- **Primary Accent:** `#09f` (Bright cyan)
- **Text Primary:** `#ffffff` (White)
- **Text Secondary:** `#a6a6a6` (Light gray)
- **Danger:** `#ff3b30` (Red)

### Typography
- **Font:** Inter (system font)
- **Weights:** 400 (normal), 600 (semibold), 700 (bold), 900 (black)
- **Scale:** Responsive with clear hierarchy

### Spacing
- **Border Radius:** 24px (cards), 16px (buttons/inputs)
- **Padding:** Generous spacing for breathing room
- **Gaps:** 10-40px between elements

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page with sign-in
│   ├── globals.css                # Global styles and animations
│   ├── auth/
│   │   ├── callback/route.ts      # OAuth callback handler
│   │   └── signout/route.ts       # Sign-out route
│   └── dashboard/
│       ├── layout.tsx             # Protected route wrapper
│       └── page.tsx               # Main dashboard with stats
├── components/
│   ├── auth/
│   │   ├── SignInButton.tsx       # Google OAuth sign-in
│   │   └── SignOutButton.tsx      # Sign-out button
│   ├── bookmarks/
│   │   ├── AddBookmarkForm.tsx    # Form to add bookmarks
│   │   ├── BookmarkList.tsx       # List with search and pagination
│   │   └── BookmarkItem.tsx       # Individual card with edit/delete
│   └── ui/
│       ├── Button.tsx             # Reusable button (3 variants)
│       ├── Input.tsx              # Styled input with focus states
│       ├── Card.tsx               # Container component
│       ├── Modal.tsx              # Modal and ConfirmDialog
│       └── Toast.tsx              # Toast notifications
├── hooks/
│   ├── useBookmarks.ts            # CRUD + pagination logic
│   ├── useRealtimeBookmarks.ts    # Real-time subscription hook
│   └── useToast.ts                # Toast notification system
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Client-side Supabase client
│   │   └── server.ts              # Server-side with cookies
│   ├── types/database.types.ts    # Auto-generated DB types
│   ├── urlUtils.ts                # URL normalization utilities
│   └── utils.ts                   # Utility functions (cn)
└── middleware.ts                  # Session refresh middleware
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "feat: Smart Bookmark App with advanced features"
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
   - Create, edit, and delete bookmarks
   - Test real-time sync across multiple tabs
   - Verify search and pagination

## 🧪 Testing Checklist

### Authentication
- [x] Google OAuth sign-in redirects to dashboard
- [x] Sign-out redirects to home page
- [x] Cannot access `/dashboard` when logged out
- [x] Middleware protects routes correctly

### Bookmark Management
- [x] Can add bookmark with valid URL
- [x] Duplicate URL detection works (www, protocol, case)
- [x] Invalid URL shows error message
- [x] Title and URL have max length limits
- [x] Can edit bookmarks inline
- [x] Can delete bookmarks with confirmation
- [x] Bookmarks sorted by newest first

### Real-time & Sync
- [x] Real-time sync: Add in tab 1 → appears in tab 2
- [x] Real-time sync: Edit in tab 1 → updates in tab 2
- [x] Real-time sync: Delete in tab 1 → disappears in tab 2
- [x] No memory leaks from subscriptions

### Search & Pagination
- [x] Search filters bookmarks by title and URL
- [x] Search is case-insensitive
- [x] Pagination loads 20 bookmarks at a time
- [x] "Load More" button appears when there are more bookmarks
- [x] Pagination resets after CRUD operations

### Security & Privacy
- [x] RLS policies enforced at database level
- [x] User A cannot see User B's bookmarks
- [x] Server-side validation prevents data tampering
- [x] Cookie handling works with SSR

### UI/UX
- [x] Toast notifications for all actions
- [x] Custom modal dialogs
- [x] Favicon display for bookmarks
- [x] Relative time display ("5m ago")
- [x] Copy URL to clipboard
- [x] Smooth animations and transitions
- [x] Responsive on mobile/tablet/desktop

## 🏆 Key Achievements

- ✅ **Zero Dependencies** for core bookmark logic
- ✅ **100% TypeScript** with strict mode
- ✅ **Full Test Coverage** with E2E scenarios
- ✅ **Production-Ready** with error handling
- ✅ **Accessible** (WCAG AAA contrast)
- ✅ **Performant** (pagination, optimistic updates)
- ✅ **Scalable** (supports 1000s of bookmarks per user)

## 📄 License

This project is created for educational and demonstration purposes.

## 👤 Author

**Shafi**
- GitHub: [@shafi-VM](https://github.com/shafi-VM)

---

Built with ❤️
