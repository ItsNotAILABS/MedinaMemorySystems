'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * Safely registers the service worker on the client side
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if ('serviceWorker' in navigator) {
      // Register service worker after page load
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('𓂀 NOVA OVO SW registered:', registration.scope);
        } catch (error) {
          console.log('SW registration failed:', error);
        }
      };

      // Wait for window load event
      if (document.readyState === 'complete') {
        void registerSW();
      } else {
        window.addEventListener('load', () => void registerSW());
      }
    }
  }, []);

  // This component renders nothing
  return null;
}
