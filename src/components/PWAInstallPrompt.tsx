'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(isMobileDevice);

    // Check if PWA is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return;
    }

    // Check if previously dismissed
    const wasDismissed = localStorage.getItem('pwa-install-prompt-dismissed');
    if (wasDismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);

      // Show prompt after 2 seconds of user interaction
      setTimeout(() => {
        if (!wasDismissed) {
          setShowPrompt(true);
        }
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          // User accepted the install prompt
          setShowPrompt(false);
          setDeferredPrompt(null);
          localStorage.setItem('pwa-install-prompt-dismissed', 'true');
        }
      } catch (error) {
        console.error('Installation prompt failed:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
    setDeferredPrompt(null);
  };

  // Don't show on desktop or if already installed
  if (!isMobile || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-green-500/20 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                GO
              </div>
              <span className="font-semibold text-white">Staybookt</span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X size={18} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-300 mb-4">
            Install Staybookt for quick access and offline support.
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              <Download size={16} />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Green accent line */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-green-600" />
      </div>
    </div>
  );
}
