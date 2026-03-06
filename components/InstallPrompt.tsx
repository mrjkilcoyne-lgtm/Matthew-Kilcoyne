import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check iOS
    const ua = navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem('tardai-install-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS guide after delay
    if (ios) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('tardai-install-dismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
        <div className="max-w-md mx-auto bg-stone-800 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone size={24} className="text-stone-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Install TARDAI</p>
            <p className="text-stone-400 text-xs mt-0.5">
              {isIOS ? 'Add to your home screen for the full experience' : 'Get the native app experience'}
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-stone-800 text-sm font-medium rounded-lg hover:bg-stone-100 transition-colors flex-shrink-0"
          >
            <Download size={14} />
            Install
          </button>
          <button onClick={handleDismiss} className="text-stone-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={handleDismiss}>
          <div className="bg-white rounded-t-3xl p-6 max-w-md w-full space-y-4 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-stone-800 text-center">Install TARDAI on iOS</h3>
            <ol className="space-y-3 text-stone-600 text-sm">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span>Tap the <strong>Share</strong> button in Safari (the square with the arrow)</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-stone-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span>Tap <strong>"Add"</strong> to install TARDAI</span>
              </li>
            </ol>
            <button onClick={handleDismiss} className="w-full py-3 bg-stone-800 text-white rounded-xl font-medium">
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
