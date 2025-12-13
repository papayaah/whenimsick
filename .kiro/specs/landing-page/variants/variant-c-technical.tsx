'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MdAutoAwesome, 
  MdPrivacyTip, 
  MdTimeline, 
  MdLocalHospital, 
  MdSpeed,
  MdOfflineBolt,
  MdAnalytics,
  MdSecurity,
  MdCode,
  MdCloudOff
} from 'react-icons/md';
import { FiActivity, FiCheckCircle, FiCpu, FiDatabase, FiShield, FiZap } from 'react-icons/fi';
import DemoSimulation from '@/components/demo/DemoSimulation';

export default function LandingPageVariantC() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('features');

  const handleGetStarted = () => {
    router.push('/setup');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section - Technical Focus */}
      <div style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-lavender) 100%)',
        borderBottom: '3px solid var(--pastel-blue-dark)',
        position: 'relative'
      }}>
        {/* Tech badges */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {['AI-Powered', 'Offline-First', 'Privacy-First'].map((badge, index) => (
            <span key={index} style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--accent-blue)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              {badge}
            </span>
          ))}
        </div>

        <div style={{ textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--accent-lavender)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '1rem'
          }}>
            Advanced Health Tracking Platform
          </div>
          
          <h1 style={{
            fontSize: '3.75rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0',
            lineHeight: '1.1',
            fontFamily: 'var(--font-geist-mono)'
          }}>
            When I&apos;m Sick
          </h1>
          
          <p style={{
            fontSize: '1.5rem',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.5'
          }}>
            Enterprise-grade symptom tracking with built-in AI analysis, zero-trust privacy architecture, and offline-first design.
          </p>

          {/* Technical specs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto'
          }}>
            {[
              { icon: FiCpu, label: 'Chrome AI (Gemini Nano)', value: 'Built-in' },
              { icon: FiDatabase, label: 'Data Storage', value: 'LocalStorage' },
              { icon: FiShield, label: 'Privacy Level', value: '100% Local' },
              { icon: FiZap, label: 'Setup Time', value: '< 30 seconds' }
            ].map((spec, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.8)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <spec.icon size={16} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{spec.label}</span>
                </div>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{spec.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '1.25rem 3rem',
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-lavender) 100%)',
                border: '2px solid var(--accent-blue)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(74, 144, 226, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: 'var(--font-geist-mono)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(74, 144, 226, 0.4)';
              }}
            >
              <MdSpeed size={24} />
              Initialize System
            </button>
            
            <button
              onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '1.25rem 2.5rem',
                background: 'transparent',
                border: '2px solid var(--accent-blue)',
                borderRadius: '12px',
                color: 'var(--accent-blue)',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-geist-mono)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-blue)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--accent-blue)';
              }}
            >
              View Architecture
            </button>
          </div>
        </div>
      </div>

      {/* Technical Architecture Section */}
      <div id="architecture" style={{
        padding: '4rem 2rem',
        background: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 3rem 0',
            textAlign: 'center',
            fontFamily: 'var(--font-geist-mono)'
          }}>
            System Architecture
          </h2>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { id: 'features', label: 'Core Features', icon: MdAutoAwesome },
              { id: 'privacy', label: 'Privacy & Security', icon: MdSecurity },
              { id: 'performance', label: 'Performance', icon: MdSpeed }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 2rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'features' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  icon: MdOfflineBolt,
                  title: 'Offline-First Architecture',
                  description: 'Chrome AI (Gemini Nano) runs entirely on-device. No internet required for analysis.',
                  specs: ['Local inference', 'Zero latency', 'Works anywhere']
                },
                {
                  icon: MdAnalytics,
                  title: 'Advanced Analytics Engine',
                  description: 'Multi-day episode tracking with trend analysis and pattern recognition.',
                  specs: ['Timeline analysis', 'Symptom correlation', 'Recovery prediction']
                },
                {
                  icon: MdCode,
                  title: 'Modern Tech Stack',
                  description: 'Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.',
                  specs: ['Type-safe', 'Component-based', 'Responsive design']
                }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'var(--pastel-blue)',
                  border: '2px solid var(--pastel-blue-dark)',
                  borderRadius: '16px',
                  padding: '2rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <feature.icon size={32} style={{ color: 'var(--accent-blue)', marginBottom: '1rem' }} />
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--accent-blue)',
                    margin: '0 0 1rem 0'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                  <ul style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                  }}>
                    {feature.specs.map((spec, specIndex) => (
                      <li key={specIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)'
                      }}>
                        <FiCheckCircle size={14} style={{ color: 'var(--accent-mint)' }} />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  icon: MdCloudOff,
                  title: 'Zero-Trust Architecture',
                  description: 'Your health data never leaves your device. No servers, no cloud, no third parties.',
                  features: ['Local-only storage', 'No data transmission', 'Complete user control']
                },
                {
                  icon: MdSecurity,
                  title: 'Privacy by Design',
                  description: 'Built from the ground up with privacy as the core principle, not an afterthought.',
                  features: ['No tracking', 'No analytics', 'No user accounts']
                }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'var(--pastel-mint)',
                  border: '2px solid var(--pastel-mint-dark)',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}>
                  <item.icon size={40} style={{ color: 'var(--accent-mint)', marginBottom: '1.5rem' }} />
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--accent-mint)',
                    margin: '0 0 1rem 0'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: '1.125rem',
                    color: 'var(--text-secondary)',
                    margin: '0 0 2rem 0',
                    lineHeight: '1.6'
                  }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {item.features.map((feature, featureIndex) => (
                      <div key={featureIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '8px'
                      }}>
                        <FiShield size={16} style={{ color: 'var(--accent-mint)' }} />
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '3rem',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  margin: '0 0 2rem 0'
                }}>
                  Optimized for Speed
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { metric: 'First Load', value: '< 2.5s', description: 'Lighthouse-optimized loading' },
                    { metric: 'AI Response', value: '< 3s', description: 'Local inference speed' },
                    { metric: 'Layout Shift', value: '0 CLS', description: 'Zero layout shift score' },
                    { metric: 'Bundle Size', value: '< 500KB', description: 'Optimized JavaScript' }
                  ].map((perf, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'var(--pastel-yellow)',
                      borderRadius: '12px',
                      border: '1px solid var(--pastel-yellow-dark)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{perf.metric}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{perf.description}</div>
                      </div>
                      <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: 'var(--accent-yellow)',
                        fontFamily: 'var(--font-geist-mono)'
                      }}>
                        {perf.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                background: 'var(--pastel-lavender)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <MdSpeed size={80} style={{ color: 'var(--accent-lavender)', marginBottom: '1rem' }} />
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--accent-lavender)',
                  margin: '0 0 1rem 0'
                }}>
                  Lighthouse Score
                </h4>
                <div style={{
                  fontSize: '4rem',
                  fontWeight: '800',
                  color: 'var(--accent-lavender)',
                  fontFamily: 'var(--font-geist-mono)'
                }}>
                  100
                </div>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                  Perfect performance score
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div style={{
        background: '#f8fafc',
        borderBottom: '3px solid #e5e7eb'
      }}>
        <div style={{
          padding: '4rem 2rem 1rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--accent-blue)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '1rem',
            fontFamily: 'var(--font-geist-mono)'
          }}>
            Live Demo Environment
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0'
          }}>
            Test Drive the Platform
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Experience the full symptom analysis and episode tracking workflow
          </p>
        </div>
        <DemoSimulation />
      </div>

      {/* Technical CTA Section */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--pastel-blue) 0%, var(--pastel-lavender) 100%)',
        borderTop: '3px solid var(--pastel-blue-dark)'
      }}>
        <h2 style={{
          fontSize: '2.75rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 1rem 0',
          fontFamily: 'var(--font-geist-mono)'
        }}>
          Deploy Your Health Tracking System
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          margin: '0 0 3rem 0',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Enterprise-grade health tracking with zero configuration required. Initialize in under 30 seconds.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '1.5rem 3.5rem',
              background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-lavender) 100%)',
              border: '2px solid var(--accent-blue)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(74, 144, 226, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-geist-mono)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(74, 144, 226, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
            }}
          >
            <FiCpu size={28} />
            Initialize System
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <span>✓ Zero configuration</span>
          <span>✓ Instant deployment</span>
          <span>✓ No dependencies</span>
          <span>✓ 100% private</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          margin: 0,
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-geist-mono)'
        }}>
          © 2024 When I&apos;m Sick • Built with Next.js 15 & Chrome AI • Educational purposes only
        </p>
      </div>
    </div>
  );
}