'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { legalAcceptanceService } from '@/services/legalAcceptanceService';
import LoadingSpinner from './LoadingSpinner';

interface LegalGateProps {
  children: React.ReactNode;
}

export default function LegalGate({ children }: LegalGateProps) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (!isClient) return;

    // Pages that should always be accessible without legal gate
    const publicPages = ['/legal-acceptance', '/terms', '/privacy', '/'];

    const checkLegalAcceptance = async () => {
      try {
        // If we're on a public page, always allow access
        if (publicPages.includes(pathname)) {
          setHasAcceptedTerms(true);
          setIsLoading(false);
          return;
        }

        const accepted = await legalAcceptanceService.hasAcceptedTerms();
        setHasAcceptedTerms(accepted);

        if (!accepted) {
          // Redirect to legal acceptance page if not accepted
          router.replace('/legal-acceptance');
        }
      } catch (error) {
        console.error('Error checking legal acceptance:', error);
        // On error, redirect to legal acceptance page to be safe
        router.replace('/legal-acceptance');
      } finally {
        setIsLoading(false);
      }
    };

    checkLegalAcceptance();

    // Subscribe to legal acceptance changes
    const unsubscribe = legalAcceptanceService.subscribe(() => {
      checkLegalAcceptance();
    });

    return () => {
      unsubscribe();
    };
  }, [router, pathname, isClient]);

  // Show loading spinner while checking legal acceptance
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#ffffff',
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  // Only render children if terms have been accepted
  if (hasAcceptedTerms) {
    return <>{children}</>;
  }

  // This should not render as we redirect to legal-acceptance page
  // But include as fallback
  return null;
}
