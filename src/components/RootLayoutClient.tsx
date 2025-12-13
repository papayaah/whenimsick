'use client';

import { usePathname } from 'next/navigation';
import FloatingNavigation from '@/components/FloatingNavigation';
import LegalGate from '@/components/LegalGate';
import FamilyPolaroid from '@/components/FamilyPolaroid';

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      {/* Alpha Version Ribbon Badge - Only show on app routes, not landing page */}
      {!isLandingPage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '-60px',
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 50%, #ffa8c5 100%)',
            color: 'white',
            padding: '8px 80px',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            transform: 'rotate(45deg)',
            boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
            zIndex: 1000,
            border: '2px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            lineHeight: '1.4',
            fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          }}
        >
          <div>
            Alpha <span style={{ fontSize: '9px', fontWeight: '400' }}>v0.1</span>
          </div>
          <div style={{ fontSize: '9px', fontWeight: '400', textTransform: 'none', letterSpacing: '0.3px' }}>
            Still Making It Better
          </div>
        </div>
      )}
      
      <LegalGate>
        {children}
        {/* Persistent Floating Navigation and Capy - Only show on app routes, not landing page */}
        {!isLandingPage && <FloatingNavigation />}
        {/* Family Polaroid - Only show on app routes, not landing page */}
        {!isLandingPage && <FamilyPolaroid />}
      </LegalGate>
    </>
  );
}
