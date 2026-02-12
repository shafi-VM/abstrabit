import { SignInButton } from '@/components/auth/SignInButton'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <div className="w-full max-w-md px-8">
        <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl shadow-2xl shadow-black/50 p-8 text-center border border-amber-500/20">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full mb-4 shadow-lg shadow-amber-500/40">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-3xl font-bold text-amber-400 mb-2 tracking-tight">
              Smart Bookmark App
            </h1>
            <p className="text-gray-400">
              Save and organize your favorite links with real-time sync across all your devices
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Secure Google OAuth authentication</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Real-time sync across all tabs</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Private and secure bookmarks</span>
            </div>
          </div>

          <SignInButton />

          <p className="mt-6 text-xs text-gray-500">
            Built with <span className="text-amber-400">Next.js</span>, <span className="text-amber-400">Supabase</span>, and <span className="text-amber-400">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </div>
  )
}
