export const metadata = {
  title: "Login - GrowthOS",
  description: "Sign in or create your GrowthOS account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
        <div className="relative flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative z-10 w-full max-w-md">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
