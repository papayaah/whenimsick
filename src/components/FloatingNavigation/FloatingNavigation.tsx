'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FiActivity } from 'react-icons/fi';
import { MdTimeline, MdAutoAwesome } from 'react-icons/md';
import CappyChat from '../CappyChat';
import './FloatingNavigation.css';
import { aiSetupService } from '@/services/aiSetupService';
import { getLastKnownAIStatus } from '@/lib/chrome-ai';
import { DEMO_STATE_EVENT, DemoState } from '@/lib/demoState';

interface FloatingNavigationProps {
  aiAvailable?: boolean | null;
  aiStatus?: string;
  appState?: {
    hasSelectedSymptoms: boolean;
    isAnalyzing: boolean;
    hasResults: boolean;
    symptomCount: number;
    currentPage?: string;
  };
  demoMode?: boolean;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  aiAvailable: aiAvailableProp,
  aiStatus: aiStatusProp,
  appState = {
    hasSelectedSymptoms: false,
    isAnalyzing: false,
    hasResults: false,
    symptomCount: 0,
    currentPage: undefined,
  },
  demoMode = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(
    aiAvailableProp ?? null
  );
  const [aiStatus, setAiStatus] = useState<string>(aiStatusProp ?? '');
  const [demoModeActive, setDemoModeActive] = useState(demoMode);

  // Listen for demo mode changes
  useEffect(() => {
    const onDemoState = (e: Event) => {
      const detail = (e as CustomEvent<DemoState>).detail || {};
      setDemoModeActive(detail.isActive);
    };

    window.addEventListener(DEMO_STATE_EVENT, onDemoState as EventListener);
    return () => {
      window.removeEventListener(DEMO_STATE_EVENT, onDemoState as EventListener);
    };
  }, []);

  // Use cached Chrome AI status for display
  useEffect(() => {
    if (aiAvailableProp === undefined || aiStatusProp === undefined) {
      // Get the last known Chrome AI status from cache
      const lastKnownStatus = getLastKnownAIStatus();
      
      if (lastKnownStatus) {
        // Use cached status
        setAiAvailable(lastKnownStatus.available);
        setAiStatus(lastKnownStatus.status);
        
        // Update demo mode based on AI availability
        if (!demoMode) {
          setDemoModeActive(!lastKnownStatus.available);
        }
      } else {
        // No cached status - check if AI is set up
        const isAISetup = aiSetupService.isAISetup();
        setAiAvailable(isAISetup);
        setAiStatus(isAISetup ? 'Chrome AI is ready' : 'Chrome AI status unknown');
        setDemoModeActive(!isAISetup);
      }
    } else {
      setAiAvailable(aiAvailableProp ?? null);
      setAiStatus(aiStatusProp ?? '');
    }
  }, [aiAvailableProp, aiStatusProp, demoMode]);

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === '/app') return 'tracker';
    if (pathname?.startsWith('/episodes')) return 'episodes';
    if (pathname?.startsWith('/glossary')) return 'glossary';
    if (pathname?.startsWith('/tools')) return 'tools';
    if (pathname?.startsWith('/setup')) return 'setup';
    return 'tracker';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: 'tracker' | 'episodes' | 'glossary') => {
    switch (tab) {
      case 'tracker':
        router.push('/app');
        break;
      case 'episodes':
        router.push('/episodes');
        break;
      case 'glossary':
        router.push('/glossary');
        break;
    }
  };

  const handleAIStatusClick = () => {
    router.push('/tools');
  };

  // Create enhanced app state with current page context
  const enhancedAppState = {
    ...appState,
    currentPage: activeTab,
  };

  // Check if we're on legal acceptance or setup page
  const isLegalAcceptancePage = pathname === '/legal-acceptance';
  const isSetupPage = pathname === '/setup';

  return (
    <>
      {/* Capy (Capybara) mascot with context-aware chat */}
      {!isLegalAcceptancePage && !isSetupPage && (
        <CappyChat
          aiAvailable={aiAvailable}
          appState={enhancedAppState}
          messageKey={pathname || ''}
          isCompactMenu={demoModeActive || isLegalAcceptancePage}
        />
      )}

      {/* Floating Navigation Bar - Horizontal Lower Right */}
      <div className='floating-action-bar' style={{
        width: (demoModeActive || isLegalAcceptancePage) ? 'fit-content' : undefined,
        minWidth: (demoModeActive || isLegalAcceptancePage) ? 'auto' : undefined,
        padding: (demoModeActive || isLegalAcceptancePage) ? '0.5rem 1rem' : undefined,
        transition: 'all 0.3s ease'
      }}>
        <div className='fab-branding'>
          <div className='fab-title'>
            <Image
              src='/logotitle.jpeg'
              alt="When I'm Sick"
              width={200}
              height={65}
              style={{
                height: (demoModeActive || isLegalAcceptancePage) ? '45px' : '65px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.3s ease'
              }}
            />
          </div>
        </div>

        {!demoModeActive && !isLegalAcceptancePage && (
          <>
            <div className='fab-divider-vertical' />

            <div className='fab-nav-items'>
              <button
                className={`fab-nav-item ${activeTab === 'tracker' ? 'active' : ''}`}
                onClick={() => handleTabChange('tracker')}
                title='Symptom Tracker'
              >
                <FiActivity size={22} />
                <span className='fab-nav-label'>Tracker</span>
              </button>
              <button
                className={`fab-nav-item ${activeTab === 'episodes' ? 'active' : ''}`}
                onClick={() => handleTabChange('episodes')}
                title='Episodes'
              >
                <MdTimeline size={22} />
                <span className='fab-nav-label'>Episodes</span>
              </button>
              <button
                className={`fab-nav-item ${activeTab === 'glossary' ? 'active' : ''}`}
                onClick={() => handleTabChange('glossary')}
                title='Glossary'
              >
                <MdAutoAwesome size={22} />
                <span className='fab-nav-label'>Glossary</span>
              </button>
            </div>

            <div className='fab-divider-vertical' />

            {/* AI Status */}
            <div className='fab-status'>
              <button
                className={`fab-status-badge ${aiAvailable ? 'available' : 'unavailable'}`}
                title={aiStatus}
                onClick={handleAIStatusClick}
              >
                <div
                  className={`status-dot ${aiAvailable ? 'available' : 'unavailable'}`}
                />
                <span className='fab-status-text'>
                  {aiAvailable ? 'AI' : 'Offline'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FloatingNavigation;
