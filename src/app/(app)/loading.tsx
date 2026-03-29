'use client';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="space-y-8 w-full max-w-4xl">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded-lg w-1/2 animate-pulse" />
        </div>

        {/* Content Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-5/6 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-4/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center mt-12">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-slate-400 rounded-full animate-spin" />
            <div className="absolute inset-1 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
