'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdAutoAwesome, MdPrivacyTip, MdTimeline, MdLocalHospital } from 'react-icons/md';
import { FiActivity, FiCheckCircle } from 'react-icons/fi';
import DemoSimulation from '@/components/demo/DemoSimulation';

export default function LandingPageVariantA() {
  const router = useRouter();

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
      {/* Hero Section - Clean & Minimal */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-lavender) 100%)',
        borderBottom: '3px solid var(--pastel-pink-dark)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: '0 0 1rem 0',
          lineHeight: '1.2'
        }}>
          When I&apos;m Sick
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: 'var(--text-secondary)',
          margin: '0 0 2rem 0',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Track your symptoms, get AI-powered insights, and understand your health journey—all while keeping your data completely private.
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: '1.25rem 3rem',
            background: 'linear-gradient(135deg, var(--pastel-coral) 0%, var(--accent-coral) 100%)',
            border: '3px solid var(--accent-coral)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(255, 117, 143, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 117, 143, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 117, 143, 0.4)';
          }}
        >
          <MdAutoAwesome size={28} />
          Get Started
        </button>
      </div>

      {/* Interactive Demo Section */}
      <div style={{
        background: 'white',
        borderBottom: '3px solid #e5e7eb'
      }}>
        <div style={{
          padding: '3rem 2rem 1rem 2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0'
          }}>
            See It In Action
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Try our interactive demo to experience how the symptom tracker works
          </p>
        </div>
        <DemoSimulation />
      </div>

      {/* Feature Highlights - Grid Layout */}
      <div style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: '0 0 3rem 0',
          textAlign: 'center'
        }}>
          Why Choose When I&apos;m Sick?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Feature Cards */}
          {[
            {
              icon: FiActivity,
              title: 'AI-Powered Analysis',
              description: 'Get instant insights about your symptoms using advanced AI technology. Understand what your body is telling you with educational analysis.',
              color: 'mint'
            },
            {
              icon: MdTimeline,
              title: 'Episode Tracking',
              description: 'Track your symptoms over multiple days and see how your condition progresses. Identify patterns and trends in your health journey.',
              color: 'blue'
            },
            {
              icon: MdLocalHospital,
              title: 'Medical Glossary',
              description: 'Learn about medical terms and conditions with our built-in glossary. Understand the terminology used in your health analysis.',
              color: 'lavender'
            },
            {
              icon: MdPrivacyTip,
              title: 'Privacy First',
              description: 'Your health data stays on your device. No servers, no cloud storage, no data sharing. Complete privacy and control over your information.',
              color: 'peach'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: `var(--pastel-${feature.color})`,
              border: `2px solid var(--pastel-${feature.color}-dark)`,
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              aspectRatio: '4/3',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <feature.icon size={32} style={{ color: `var(--accent-${feature.color})` }} />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: `var(--accent-${feature.color})`,
                margin: '0 0 1rem 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6',
                flex: 1
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--pastel-coral) 0%, var(--pastel-pink) 100%)',
        borderTop: '3px solid var(--pastel-coral-dark)'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: '0 0 1rem 0'
        }}>
          Ready to Start Tracking?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          margin: '0 0 2rem 0',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Set up your AI-powered symptom tracker in just a few seconds
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: '1.25rem 3rem',
            background: 'linear-gradient(135deg, var(--accent-coral) 0%, #ff5a7e 100%)',
            border: '3px solid var(--accent-coral)',
            borderRadius: '16px',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(255, 117, 143, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 117, 143, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 117, 143, 0.4)';
          }}
        >
          <FiCheckCircle size={28} />
          Get Started Now
        </button>
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
          fontSize: '0.875rem'
        }}>
          © 2024 When I&apos;m Sick. For educational purposes only. Not medical advice.
        </p>
      </div>
    </div>
  );
}