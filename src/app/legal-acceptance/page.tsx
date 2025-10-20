'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import { MdCheck, MdGavel, MdVerifiedUser, MdFactCheck, MdCheckCircle } from 'react-icons/md';
import { legalAcceptanceService } from '@/services/legalAcceptanceService';

export default function LegalAcceptancePage() {
  const router = useRouter();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [declineMessage, setDeclineMessage] = useState<string | null>(null);
  
  // Capy animation state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<'waving' | 'chat' | 'idle'>('waving');
  const [isClient, setIsClient] = useState(false);

  const canProceed = hasAcceptedTerms && hasAcceptedPrivacy;

  // Animation segments
  const CAPY_SEGMENTS = {
    waving: { start: 4.0, end: 5.0, loop: false },
    chat: { start: 4.0, end: 12.0, loop: true },
    idle: { start: 20.0, end: 24.0, loop: true },
  };

  // Ensure client before using portals/timers
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Capy animation sequence
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const segment = CAPY_SEGMENTS[currentSegment];
    
    // Ensure video is muted for Safari autoplay
    video.muted = true;
    video.currentTime = segment.start;
    video.loop = segment.loop;
    
    // Try to play video, handle Safari autoplay restrictions gracefully
    video.play().catch(() => {
      // Don't show error to user for Safari autoplay restrictions
    });

    const handleTimeUpdate = () => {
      if (video.currentTime >= segment.end) {
        if (segment.loop) {
          video.currentTime = segment.start;
        } else {
          // Non-looping segment ended
          if (currentSegment === 'waving') {
            // After waving, play chat and show message
            setCurrentSegment('chat');
            setShowSpeechBubble(true);
            
            // After 8 seconds, hide bubble and go to idle
            setTimeout(() => {
              setShowSpeechBubble(false);
              setTimeout(() => {
                setCurrentSegment('idle');
              }, 500);
            }, 8000);
          }
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegment]);

  const funnyMessages = [
    { text: "Hold up! You gotta check those boxes first... I'm not getting in trouble for this!", icon: MdFactCheck },
    { text: "Whoa whoa whoa! Read the fine print, friend. I need you to check those boxes!", icon: MdVerifiedUser },
    { text: "Not so fast! My lawyer says you need to accept the terms first... Yes, I have a lawyer.", icon: MdGavel },
    { text: "Hey! Those checkboxes aren't gonna check themselves! Let's do this by the book!", icon: MdFactCheck },
    { text: "Before we become best friends, you gotta agree to the boring stuff first! Check those boxes!", icon: MdCheckCircle }
  ];

  const [displayMessage] = useState(() => 
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  );

  const handleAccept = async () => {
    if (canProceed) {
      try {
        // Store acceptance in local storage
        await legalAcceptanceService.acceptTerms();
        // Navigate to the main app
        router.replace('/');
      } catch (error) {
        console.error('Error accepting terms:', error);
        // Still navigate even if storage fails
        router.replace('/');
      }
    }
  };

  const handleDecline = () => {
    // Web cannot be programmatically closed; show inline guidance
    const msg = 'Please close this browser tab to exit.';
    setDeclineMessage(msg);
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        {/* Capy Character - Bottom Center */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '-13px', 
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          overflow: 'hidden',
          zIndex: 1000,
        }}
      >
        <video
          ref={videoRef}
          src="/capy-transparent.webm"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            position: 'relative',
            bottom: '0',
          }}
          muted={true}
          playsInline={true}
          preload="auto"
        />
        
        {/* Speech Bubble via portal to avoid clipping */}
        {isClient && showSpeechBubble && typeof document !== 'undefined' &&
          ReactDOM.createPortal(
            <div
              style={{
                position: 'fixed',
                bottom: '200px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fff',
                border: '2px solid #007bff',
                borderRadius: '20px',
                padding: '16px',
                maxWidth: '360px',
                minWidth: '300px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                zIndex: 2147483647,
                transition: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '12px solid #007bff',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #fff',
                }}
              />
              <displayMessage.icon 
                size={24} 
                style={{ 
                  color: '#007bff', 
                  flexShrink: 0,
                  marginTop: '2px'
                }} 
              />
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#212529',
                  lineHeight: '1.5',
                  flex: 1,
                }}
              >
                {displayMessage.text}
              </p>
            </div>,
            document.body
          )
        }
      </div>

      <div style={{ 
        padding: '1.5rem', 
        paddingBottom: '1.5rem', 
        maxWidth: '550px', 
        margin: '2rem auto 0',
        background: 'linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-coral) 100%)',
        borderRadius: '16px',
        border: '2px solid var(--pastel-peach-dark)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}>
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '1.25rem',
            color: 'var(--accent-peach)',
            fontSize: '1.75rem',
            fontWeight: '400',
            fontFamily: 'Montserrat, sans-serif'
          }}
        >
          Legal Acceptance
        </h1>

        <div style={{ marginBottom: '1.5rem' }}>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}
          >
            To use <span className="brand-font" style={{ 
              fontWeight: '600', 
              color: 'var(--accent-peach)' 
            }}>When I&apos;m Sick</span>, you need to agree to our Terms of Use and
            Privacy Policy.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <button
              onClick={() => router.push('/terms')}
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--pastel-blue)',
                border: '2px solid var(--pastel-blue-dark)',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#007bff',
                fontWeight: '500',
                fontSize: '0.9375rem',
              }}
            >
              Terms of Use
            </button>

            <button
              onClick={() => router.push('/privacy')}
              style={{
                padding: '10px 14px',
                backgroundColor: '#e7f3ff',
                borderRadius: '10px',
                border: '2px solid var(--pastel-blue-dark)',
                cursor: 'pointer',
                color: '#007bff',
                fontWeight: '500',
                fontSize: '0.9375rem',
              }}
            >
              Privacy Policy
            </button>
          </div>

          {/* Acceptance Checkboxes */}
          <div style={{ marginBottom: '0.75rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <button
                onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  marginRight: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: hasAcceptedTerms ? '#007bff' : 'transparent',
                }}
              >
                {hasAcceptedTerms && <MdCheck size={14} color='#ffffff' />}
              </button>
              <span style={{ color: '#495057', fontSize: '0.9375rem' }}>
                I have read and agree to the Terms of Use
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <button
                onClick={() => setHasAcceptedPrivacy(!hasAcceptedPrivacy)}
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  marginRight: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: hasAcceptedPrivacy
                    ? '#007bff'
                    : 'transparent',
                }}
              >
                {hasAcceptedPrivacy && <MdCheck size={14} color='#ffffff' />}
              </button>
              <span style={{ color: '#495057', fontSize: '0.9375rem' }}>
                I have read and agree to the Privacy Policy
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <button
            onClick={handleAccept}
            disabled={!canProceed}
            style={{
              width: '100%',
              backgroundColor: canProceed ? '#007bff' : '#adb5bd',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              marginBottom: '12px',
              color: '#ffffff',
              fontSize: '0.9375rem',
              fontWeight: '400',
            }}
          >
            Accept & Continue
          </button>

          <button
            onClick={handleDecline}
            style={{
              width: '100%',
              padding: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6c757d',
              fontSize: '0.875rem',
            }}
          >
            Decline & Exit
          </button>

          {declineMessage && (
            <div
              style={{
                backgroundColor: '#FFF7E6',
                border: '1px solid #FFE0A3',
                borderRadius: '8px',
                padding: '10px',
                marginTop: '8px',
              }}
            >
              <p
                style={{
                  color: '#7A5B00',
                  fontSize: '13px',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {declineMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
