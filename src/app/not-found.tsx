import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col items-center justify-center px-4 py-20">
      {/* Main Content Container */}
      <div className="max-w-2xl w-full text-center">
        {/* SVG Broken Link Icon */}
        <div className="mb-12 flex justify-center">
          <svg
            className="w-32 h-32 md:w-40 md:h-40"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Chain Link */}
            <g opacity="0.15">
              <path
                d="M35 40C35 30 43 22 53 22H67C77 22 85 30 85 40"
                stroke="#2C3E50"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M35 80C35 90 43 98 53 98H67C77 98 85 90 85 80"
                stroke="#2C3E50"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="35" cy="60" r="5" fill="#2C3E50" />
              <circle cx="85" cy="60" r="5" fill="#2C3E50" />
            </g>

            {/* Broken Link - Top Part */}
            <path
              d="M45 30C45 22 51 16 59 16H71C79 16 85 22 85 30V40"
              stroke="#27AE60"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Broken Link - Bottom Part */}
            <path
              d="M45 90V80C45 72 51 66 59 66H71C79 66 85 72 85 80"
              stroke="#27AE60"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Break / Gap indicator */}
            <line x1="60" y1="45" x2="60" y2="65" stroke="#27AE60" strokeWidth="2.5" strokeDasharray="4,2" />
            <circle cx="60" cy="55" r="4" fill="#27AE60" />
          </svg>
        </div>

        {/* 404 with Gradient */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black font-sans tracking-tighter">
            <span
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #2C3E50 0%, #27AE60 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </span>
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Page not found
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-lg mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {/* Primary Button - Go to Dashboard */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Dashboard
          </Link>

          {/* Secondary Button - Go Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-semibold rounded-lg transition-all duration-200 bg-white hover:bg-slate-50"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 19l-7-7 7-7m6 0l-7 7 7 7"
              />
            </svg>
            Go Home
          </Link>
        </div>

        {/* Staybookt Branding Footer */}
        <div className="border-t border-slate-200 pt-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#2C3E50] flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Stay<span className="text-[#27AE60]">bookt</span>
            </span>
          </div>
          <p className="text-sm text-slate-500">
            The Operating System for Service Business Growth
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-50 rounded-full opacity-40 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-slate-100 rounded-full opacity-30 blur-3xl" />
      </div>
    </div>
  );
}
