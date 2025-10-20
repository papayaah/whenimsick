'use client';

import React, { useState, useEffect } from 'react';
import { symptomAnalyzer } from '@/lib/chrome-ai';
import { CAPY_STATE_EVENT, CapyState } from '@/lib/capyState';
import './CappyChat.css';

interface CappyChatProps {
  aiAvailable: boolean | null;
  appState: {
    hasSelectedSymptoms: boolean;
    isAnalyzing: boolean;
    hasResults: boolean;
    symptomCount: number;
    currentPage?: string; // Add current page context
  };
  // Used to force-refresh messages on navigation changes without unmounting component
  messageKey?: string;
  // Indicates if the floating menu is in its smaller state (demo mode or legal acceptance)
  isCompactMenu?: boolean;
}

// Strip all emojis and emoticons from text
const stripEmojis = (text: string): string => {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
    .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
    .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
    .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
    .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
    .replace(/[\u{200D}]/gu, '')            // Zero Width Joiner
    .trim();
};

// Calculate how long to show message based on word count
const calculateReadingTime = (text: string): number => {
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const characters = text.length;
  
  // Use both word count and character count for better estimation
  const baseTime = 3000; // Minimum 3 seconds
  const timePerWord = 400; // 400ms per word (~150 words per minute - comfortable reading)
  const timePerChar = 50;  // 50ms per character as backup measure
  
  // Use the longer of the two calculations
  const wordBasedTime = baseTime + (words * timePerWord);
  const charBasedTime = baseTime + (characters * timePerChar);
  const calculatedTime = Math.max(wordBasedTime, charBasedTime);
  
  const maxTime = 15000; // Maximum 15 seconds
  return Math.min(calculatedTime, maxTime);
};

const CappyChat: React.FC<CappyChatProps> = ({ aiAvailable, appState, messageKey, isCompactMenu = false }) => {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasPlayedWakeUp, setHasPlayedWakeUp] = useState(false);
  const prevHasResultsRef = React.useRef<boolean>(false);
  const [hasResultsLocal, setHasResultsLocal] = useState(false);
  const idleTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const chatTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  type SegmentKey = 'wake' | 'waving' | 'chat' | 'analyzing' | 'idle' | 'eat' | 'result';
  const [currentSegment, setCurrentSegment] = useState<SegmentKey>('wake');

  // Central lookup for Capy animation segments (seconds)
  const CAPY_SEGMENTS: Record<SegmentKey, { start: number; end: number; loop: boolean }> = {
    wake: { start: 0.0, end: 4.0, loop: false },
    waving: { start: 4.0, end: 7.25, loop: false },
    chat: { start: 4.0, end: 12.0, loop: true },
    analyzing: { start: 13.7, end: 19.3, loop: true },
    idle: { start: 20.0, end: 24.0, loop: true },
    eat: { start: 24.25, end: 29.0, loop: false },
    result: { start: 29.5, end: 33.0, loop: false },
  };

  // Decide active segment based on app state and external events
  useEffect(() => {
    prevHasResultsRef.current = appState.hasResults;

    // Clear any existing timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (chatTimerRef.current) {
      clearTimeout(chatTimerRef.current);
      chatTimerRef.current = null;
    }

    // Priority 1: Analyzing state
    if (appState.isAnalyzing) {
      setCurrentSegment('analyzing');
      return;
    }

    // Priority 2: Results state
    if (appState.hasResults) {
      setCurrentSegment('result');
      return;
    }

    // Priority 3: App reload/first start → play wake+waving sequence ONCE
    if (!hasPlayedWakeUp) {
      setCurrentSegment('wake');
      return;
    }

    // After wake+waving has played, Cappy should be mostly idle/eating
    // and occasionally chat about the current page
    
    // Start with idle or eat (70% idle, 30% eat)
    const shouldEat = Math.random() < 0.3;
    const initialSegment = shouldEat ? 'eat' : 'idle';
    setCurrentSegment(initialSegment);
    
    // Set up idle behavior: alternate between idle/eat
    const idleRotationTimer = setTimeout(() => {
      if (!appState.isAnalyzing && !appState.hasResults) {
        const nextShouldEat = Math.random() < 0.3;
        setCurrentSegment(nextShouldEat ? 'eat' : 'idle');
      }
    }, 8000); // Rotate idle/eat every 8 seconds
    
    idleTimerRef.current = idleRotationTimer as unknown as NodeJS.Timeout;
    
    // If on a specific page (episodes/glossary), occasionally show chat
    if (appState.currentPage && (appState.currentPage === 'episodes' || appState.currentPage === 'glossary')) {
      // 20% chance to show chat after a delay
      if (Math.random() < 0.2) {
        const chatDelay = setTimeout(() => {
          if (!appState.isAnalyzing && !appState.hasResults) {
            setCurrentSegment('chat');
            
            // After chatting for a bit, go back to idle/eat
            const returnToIdleTimer = setTimeout(() => {
              if (!appState.isAnalyzing && !appState.hasResults) {
                const backToEat = Math.random() < 0.3;
                setCurrentSegment(backToEat ? 'eat' : 'idle');
              }
            }, 6000); // Chat for 6 seconds then back to idle
            
            chatTimerRef.current = returnToIdleTimer as unknown as NodeJS.Timeout;
          }
        }, 3000 + Math.random() * 5000); // Random delay between 3-8 seconds
        
        chatTimerRef.current = chatDelay as unknown as NodeJS.Timeout;
      }
    }
    
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (chatTimerRef.current) clearTimeout(chatTimerRef.current);
    };
  }, [appState.isAnalyzing, appState.hasResults, appState.currentPage, hasPlayedWakeUp]);

  // Listen to global Capy state events to switch segments instantly
  useEffect(() => {
    const onCapyState = (e: Event) => {
      const detail = (e as CustomEvent<CapyState>).detail || {};
      if (detail.isAnalyzing) {
        setCurrentSegment('analyzing');
        setShowSpeechBubble(false);
        return;
      }
      if (detail.hasResults) {
        setCurrentSegment('result');
        setHasResultsLocal(true);
        return;
      }
      if (detail.hasSelectedSymptoms === false && prevHasResultsRef.current) {
        // Leaving results page - go to idle/eat instead of replaying wake
        const shouldEat = Math.random() < 0.3;
        setCurrentSegment(shouldEat ? 'eat' : 'idle');
        return;
      }
    };

    window.addEventListener(CAPY_STATE_EVENT, onCapyState as EventListener);
    return () => {
      window.removeEventListener(CAPY_STATE_EVENT, onCapyState as EventListener);
    };
  }, []);

  // On any route change, if we were showing results, go to idle/eat
  useEffect(() => {
    if (hasResultsLocal && !appState.hasResults && !appState.isAnalyzing) {
      setHasResultsLocal(false);
      // Don't replay wake - go directly to idle or eat
      const shouldEat = Math.random() < 0.3;
      setCurrentSegment(shouldEat ? 'eat' : 'idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageKey]);

  // Apply segment playback and loop control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seg = CAPY_SEGMENTS[currentSegment];
    // Snap into segment if outside
    if (video.currentTime < seg.start || video.currentTime > seg.end) {
      video.currentTime = seg.start;
    }

    // Ensure playback
    if (video.paused) {
      const p = video.play();
      if (p && typeof p.then === 'function') p.catch(() => {});
    }

    const handleTimeUpdate = () => {
      const now = video.currentTime;
      if (currentSegment === 'wake') {
        if (now >= seg.end) {
          setCurrentSegment('waving');
          video.currentTime = CAPY_SEGMENTS.waving.start;
        }
        return;
      }

      if (currentSegment === 'waving') {
        if (now >= seg.end) {
          setHasPlayedWakeUp(true);
          // After wake+waving, go to chat briefly, then to idle/eat
          setCurrentSegment('chat');
          video.currentTime = CAPY_SEGMENTS.chat.start;
          
          // After a brief chat (3 seconds), switch to idle/eat
          setTimeout(() => {
            if (!appState.isAnalyzing && !appState.hasResults) {
              const shouldEat = Math.random() < 0.3;
              const nextSegment = shouldEat ? 'eat' : 'idle';
              setCurrentSegment(nextSegment);
            }
          }, 3000);
        }
        return;
      }

      if (currentSegment === 'chat' || currentSegment === 'analyzing' || currentSegment === 'idle') {
        if (now >= seg.end) {
          video.currentTime = seg.start; // loop within segment
        }
        return;
      }

      if (currentSegment === 'eat') {
        if (now >= seg.end) {
          // After eating, go back to idle
          setCurrentSegment('idle');
          video.currentTime = CAPY_SEGMENTS.idle.start;
        }
        return;
      }

      if (currentSegment === 'result') {
        if (now >= seg.end) {
          video.currentTime = seg.end;
          video.pause(); // hold last frame until state changes
        }
        return;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegment, appState.hasSelectedSymptoms, appState.currentPage]);

  // Generate context-aware message based on app state
  const generateCapyMessage = async (): Promise<string> => {
    if (!aiAvailable || isGeneratingMessage) return "Hey! I'm Capy and I'm here to help!";

    setIsGeneratingMessage(true);
    let generatedMessage = '';
    try {
      let prompt = '';
      let fallbackMessages: string[] = [];

      // Determine context and create appropriate prompt
      if (appState.isAnalyzing) {
        // User is currently analyzing
        prompt = `You are Capy, a friendly capybara. The user is analyzing ${appState.symptomCount} symptom${appState.symptomCount === 1 ? '' : 's'}. Write ONE short sentence that's encouraging and slightly funny. No emojis.`;
        
        fallbackMessages = [
          "Let me put on my tiny doctor glasses!",
          "Capy brain activated!",
          "Time to be a medical capybara!",
          "Working my capy magic!",
          "Putting on my lab coat!",
          "Analyzing like a pro!"
        ];
      } else if (appState.hasResults) {
        // User has seen results
        prompt = `You are Capy, a friendly capybara. The user just saw their results. Write ONE short encouraging sentence. No emojis.`;
        
        fallbackMessages = [
          "Great job tracking your health!",
          "You've got this!",
          "You're doing awesome!",
          "Hope you feel better soon!",
          "Keep it up!",
          "Self-care champion!"
        ];
      } else if (appState.hasSelectedSymptoms) {
        // User has selected symptoms but hasn't analyzed yet
        prompt = `You are Capy, a friendly capybara. The user selected ${appState.symptomCount} symptom${appState.symptomCount === 1 ? '' : 's'}. Write ONE short sentence suggesting they can analyze or add details. No emojis.`;
        
        fallbackMessages = [
          `Nice! Ready to analyze ${appState.symptomCount} symptom${appState.symptomCount === 1 ? '' : 's'}?`,
          `Got ${appState.symptomCount} logged! Hit analyze when ready!`,
          `Awesome! Add details or analyze now!`,
          `Looking good! Ready to analyze?`,
          `Perfect! Analyze or add more details!`,
          `Sweet! Click analyze when ready!`
        ];
      } else if (appState.currentPage === 'episodes') {
        // User is viewing episodes page
        prompt = `You are Capy, a friendly capybara. The user is viewing their health history. Write ONE short supportive sentence. No emojis.`;
        
        fallbackMessages = [
          "Looking at your health history?",
          "Great job tracking episodes!",
          "Reviewing your health journey?",
          "Past episodes teach us a lot!",
          "Staying on top of health tracking!",
          "Looking back helps us look forward!"
        ];
      } else if (appState.currentPage === 'glossary') {
        // User is viewing glossary page
        prompt = `You are Capy, a friendly capybara. The user is learning health terms. Write ONE short encouraging sentence. No emojis.`;
        
        fallbackMessages = [
          "Learning health terms?",
          "Exploring the glossary?",
          "Curious about symptoms?",
          "Becoming a health advocate!",
          "Smart move reading up!",
          "Knowledge is power!"
        ];
      } else {
        // Initial state - no symptoms selected
        prompt = `You are Capy, a friendly capybara. The user just opened the app. Write ONE short welcoming sentence. No emojis.`;
        
        fallbackMessages = [
          "Hey! I'm Capy, your health buddy!",
          "Welcome! Let's track symptoms!",
          "Hi! Ready to check in?",
          "Heyyy! Capy here!",
          "Hello! I'm here to help!",
          "Yo! Let's see how you're doing!"
        ];
      }

      // Use AI 50% of the time for more varied responses
      if (Math.random() < 0.5) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response = await (symptomAnalyzer as any)['languageModel']?.prompt(prompt);

          if (response && typeof response === 'string' && response.trim()) {
            // Strip emojis from AI response
            generatedMessage = stripEmojis(response.trim());
          } else {
            // Fallback to random message
            generatedMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
          }
        } catch {
          generatedMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        }
      } else {
        // Use random predefined message
        generatedMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      }
    } catch {
      generatedMessage = "Hey! I'm Capy and I'm here to help!";
    } finally {
      setIsGeneratingMessage(false);
    }

    setSpeechMessage(generatedMessage);
    return generatedMessage;
  };

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    // Only show speech bubble during chat or waving segments
    // Suppress during analyzing, idle, eat, result
    if (appState.isAnalyzing || currentSegment === 'analyzing' || currentSegment === 'idle' || currentSegment === 'eat' || currentSegment === 'result' || currentSegment === 'wake') {
      setShowSpeechBubble(false);
      return () => {};
    }

    // Show speech bubble when chatting or waving
    if (currentSegment === 'chat' || currentSegment === 'waving') {
      const generateAndShow = async () => {
        const message = await generateCapyMessage();

        // If we are in waving, delay to 7.25s; otherwise show immediately
        const delay = currentSegment === 'waving' ? 7250 : 0;

        showTimer = setTimeout(() => {
          setShowSpeechBubble(true);
          const readingTime = calculateReadingTime(message);
          hideTimer = setTimeout(() => {
            setShowSpeechBubble(false);
          }, readingTime);
        }, delay);
      };

      generateAndShow();

      return () => {
        if (showTimer) clearTimeout(showTimer);
        if (hideTimer) clearTimeout(hideTimer);
        setShowSpeechBubble(false);
      };
    }
    
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAvailable, appState.hasSelectedSymptoms, appState.isAnalyzing, appState.hasResults, appState.currentPage, messageKey, currentSegment]);

  // Detect Safari for video format compatibility
  const isSafari = typeof window !== 'undefined' && 
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const videoSrc = isSafari ? '/capy-transparent.mp4' : '/capy-transparent.webm';

  return (
    <div 
      className='fab-capybara-video-container' 
      style={{ 
        height: '320px',
        right: isCompactMenu ? '-3rem' : '2rem'
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        className='fab-capybara-video'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
      
      {/* Speech Bubble */}
      {showSpeechBubble && speechMessage && (
        <div className='speech-bubble'>
          <div className='speech-bubble-content'>
            <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: '1.4' }}>
              {speechMessage}
            </p>
          </div>
          <div className='speech-bubble-tail'></div>
        </div>
      )}
    </div>
  );
};

export default CappyChat;

