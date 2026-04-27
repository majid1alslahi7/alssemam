'use client';
import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] تثبيت: ${outcome}`);
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      background: '#1F4E79',
      color: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      zIndex: 9999,
      direction: 'rtl'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>📱</span>
        <div>
          <strong style={{ fontSize: '16px' }}>تثبيت تطبيق شركة السمام</strong>
          <p style={{ margin: '4px 0 0', fontSize: '14px', opacity: 0.9 }}>للوصول السريع وتجربة أفضل</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleInstall}
          style={{
            background: 'white',
            color: '#1F4E79',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          تثبيت
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.5)',
            padding: '8px 12px',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          لاحقاً
        </button>
      </div>
    </div>
  );
}
