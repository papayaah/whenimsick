'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdFavorite, MdLocalHospital, MdTimeline, MdLightbulb, MdClose, MdAutoAwesome } from 'react-icons/md';
import { FiHeart, FiActivity } from 'react-icons/fi';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className='app-container-fullwidth'>
      <div className='app-main-content-fullwidth'>
        <div className='app-card-wrapper'>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '3rem 2rem',
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Close Button */}
            <button
              onClick={() => router.push('/')}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'var(--accent-coral)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <MdClose size={24} style={{ color: 'var(--text-secondary)' }} />
            </button>

            {/* Header with Family Photo */}
            <div style={{
              background: 'linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-lavender) 100%)',
              border: '2px solid var(--pastel-pink-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              {/* Polaroid Photo */}
              <div
                style={{
                  background: 'white',
                  padding: '12px 12px 45px 12px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'rotate(-3deg)',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    position: 'relative'
                  }}
                >
                  <Image
                    src="/family.jpg"
                    alt="My Family"
                    fill
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: '8px',
                    textAlign: 'center',
                    fontFamily: "'Brush Script MT', cursive, 'Comic Sans MS'",
                    fontSize: '14px',
                    color: '#555',
                    fontStyle: 'italic'
                  }}
                >
                  My family ❤️
                </div>
              </div>

              {/* Title */}
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <FiHeart size={32} style={{ color: 'var(--accent-pink)' }} />
                  <h1 style={{
                    fontSize: '2rem',
                    margin: 0,
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    About <span className="brand-font">When I&apos;m Sick</span>
                  </h1>
                </div>
                <p style={{
                  margin: 0,
                  color: 'var(--text-secondary)',
                  fontSize: '1.125rem',
                  lineHeight: '1.6'
                }}>
                  A personal project built with love for my family&apos;s health
                </p>
              </div>
            </div>

            {/* Why I Built This */}
            <div style={{
              background: 'var(--pastel-blue)',
              border: '2px solid var(--pastel-blue-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--accent-blue)',
                marginBottom: '1rem'
              }}>
                <MdLightbulb size={28} />
                Why I Built This
              </h2>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1.0625rem',
                lineHeight: '1.8',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <p style={{ margin: 0 }}>
                  Hey! So here&apos;s the thing - I get sick. Like, a lot. And every time I do, I try to remember what happened last time I felt this way, or how long that cold lasted, or what symptoms I had. But honestly? I can never remember the details.
                </p>
                <p style={{ margin: 0 }}>
                  Then when I finally go see my doctor, they ask me all these questions like &quot;When did this start?&quot; and &quot;What other symptoms did you have?&quot; and I&apos;m just sitting there like... uh... it was sometime last week? Maybe? 🤷
                </p>
                <p style={{ margin: 0 }}>
                  That&apos;s when I realized - I need to track this stuff! Not just for me, but for my whole family. How many times did we get sick this year? Was it really &quot;just a cold&quot; or was it something else? Having a record of all this is actually super important.
                </p>
              </div>
            </div>

            {/* What Makes It Special */}
            <div style={{
              background: 'var(--pastel-mint)',
              border: '2px solid var(--pastel-mint-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--accent-mint)',
                marginBottom: '1rem'
              }}>
                <FiActivity size={28} />
                What Makes It Special
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  <MdLocalHospital size={24} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Better Doctor Visits</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      No more trying to remember when symptoms started or what happened. I have all the details right here to share with my doctor.
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  <MdTimeline size={24} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Track Patterns</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      I can see how often I get sick, how long illnesses typically last, and if there are any patterns I should know about.
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  padding: '1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'start'
                }}>
                  <MdFavorite size={24} style={{ color: 'var(--accent-mint)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Peace of Mind</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                      Having a record of my health helps me feel more in control and less anxious about what&apos;s happening with my body.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Tech */}
            <div style={{
              background: 'var(--pastel-lavender)',
              border: '2px solid var(--pastel-lavender-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--accent-lavender)',
                marginBottom: '1rem'
              }}>
                <MdAutoAwesome size={28} />
                Built with Chrome AI
              </h2>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1.0625rem',
                lineHeight: '1.8'
              }}>
                <p style={{ margin: '0 0 1rem 0' }}>
                  I wanted to use AI to help analyze symptoms and provide educational insights, but I also care deeply about privacy. That&apos;s why I built this with Chrome&apos;s built-in AI - everything happens right on your device. No servers, no cloud processing, just your browser helping you understand your health.
                </p>
                <p style={{ margin: 0 }}>
                  Your health data never leaves your device. It&apos;s stored locally in your browser, completely private and secure. Because your health information is personal, and it should stay that way.
                </p>
              </div>
            </div>

            {/* Support & Resources */}
            <div style={{
              background: 'var(--pastel-yellow)',
              border: '2px solid var(--pastel-yellow-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--accent-yellow)',
                marginBottom: '1rem'
              }}>
                Support & Resources
              </h2>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '1.0625rem',
                lineHeight: '1.8',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Support:</strong>{' '}
                  <a 
                    href="https://strostudio.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--accent-blue)', 
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--accent-blue)'
                    }}
                  >
                    https://strostudio.com
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>GitHub:</strong>{' '}
                  <a 
                    href="https://github.com/papayaah/whenimsick" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--accent-blue)', 
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--accent-blue)'
                    }}
                  >
                    https://github.com/papayaah/whenimsick
                  </a>
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Follow me on X:</strong>{' '}
                  <a 
                    href="https://x.com/papayaahtries" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'var(--accent-blue)', 
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--accent-blue)'
                    }}
                  >
                    @papayaahtries
                  </a>
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div style={{
              background: 'linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-coral) 100%)',
              border: '2px solid var(--pastel-coral-dark)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0 0 1.5rem 0',
                color: 'var(--text-secondary)',
                fontSize: '1.0625rem',
                lineHeight: '1.8'
              }}>
                I hope this app helps you as much as it helps me and my family. Take care of yourself!
              </p>
              <button
                onClick={() => router.push('/')}
                style={{
                  padding: '1rem 2rem',
                  background: 'white',
                  border: '2px solid var(--pastel-coral-dark)',
                  borderRadius: '12px',
                  color: 'var(--accent-coral)',
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                Start Tracking Your Health →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

