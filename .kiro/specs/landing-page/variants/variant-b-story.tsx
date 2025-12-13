'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdAutoAwesome, MdPrivacyTip, MdTimeline, MdLocalHospital, MdFavorite, MdShield } from 'react-icons/md';
import { FiActivity, FiCheckCircle, FiHeart, FiUser } from 'react-icons/fi';
import DemoSimulation from '@/components/demo/DemoSimulation';

export default function LandingPageVariantB() {
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
      {/* Hero Section - Story-Driven */}
      <div style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--pastel-pink) 0%, var(--pastel-lavender) 50%, var(--pastel-mint) 100%)',
        borderBottom: '3px solid var(--pastel-pink-dark)',
        position: 'relative'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MdFavorite size={24} style={{ color: 'var(--accent-pink)' }} />
        </div>
        
        <div style={{
          fontSize: '1rem',
          color: 'var(--accent-lavender)',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1rem'
        }}>
          Your Health Journey Starts Here
        </div>
        
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.1'
        }}>
          When I&apos;m Sick
        </h1>
        
        <p style={{
          fontSize: '1.75rem',
          color: 'var(--text-secondary)',
          margin: '0 0 1rem 0',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.5',
          fontWeight: '500'
        }}>
          We know being sick is scary. That&apos;s why we built a gentle companion to help you understand your symptoms and track your recovery.
        </p>
        
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-muted)',
          margin: '0 0 3rem 0',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          AI-powered insights • Complete privacy • Your data never leaves your device
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleGetStarted}
            style={{
              padding: '1.5rem 3.5rem',
              background: 'linear-gradient(135deg, var(--accent-coral) 0%, #ff5a7e 100%)',
              border: '3px solid var(--accent-coral)',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(255, 117, 143, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 117, 143, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 117, 143, 0.4)';
            }}
          >
            <FiHeart size={28} />
            Start Your Journey
          </button>
          
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              padding: '1.5rem 3rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '20px',
              color: 'var(--text-primary)',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            See How It Works
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div style={{
        padding: '2rem',
        background: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            { icon: MdShield, text: '100% Private', subtext: 'Data stays on your device' },
            { icon: FiUser, text: 'No Account Required', subtext: 'Start using immediately' },
            { icon: MdAutoAwesome, text: 'AI-Powered', subtext: 'Advanced symptom analysis' }
          ].map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <item.icon size={24} style={{ color: 'var(--accent-mint)' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9375rem' }}>{item.text}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.subtext}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div id="demo" style={{
        background: 'white',
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
            letterSpacing: '0.1em',
            marginBottom: '1rem'
          }}>
            Interactive Demo
          </div>
          <h2 style={{
            fontSize: '2.75rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0'
          }}>
            Experience the Magic
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            margin: '0 0 2rem 0',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            See how our AI gently guides you through understanding your symptoms and tracking your recovery journey
          </p>
        </div>
        <DemoSimulation />
      </div>

      {/* Story-Driven Features */}
      <div style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.75rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 1rem 0'
          }}>
            Built with Care, Just for You
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Every feature is designed to make your health journey less overwhelming and more empowering
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            {
              icon: FiActivity,
              title: 'Gentle AI Analysis',
              story: 'Our AI speaks in plain language, not medical jargon. Get insights that actually help you understand what\'s happening.',
              color: 'mint',
              benefit: 'Less anxiety, more clarity'
            },
            {
              icon: MdTimeline,
              title: 'Your Recovery Story',
              story: 'Watch your symptoms improve over time. See patterns that help you understand your body better.',
              color: 'blue',
              benefit: 'Hope through progress'
            },
            {
              icon: MdLocalHospital,
              title: 'Learn as You Go',
              story: 'Discover what medical terms mean in simple language. Build confidence in health conversations.',
              color: 'lavender',
              benefit: 'Knowledge is power'
            },
            {
              icon: MdPrivacyTip,
              title: 'Your Safe Space',
              story: 'Your health information is deeply personal. That\'s why it never leaves your device. Ever.',
              color: 'peach',
              benefit: 'Complete peace of mind'
            }
          ].map((feature, index) => (
            <div key={index} style={{
              background: `var(--pastel-${feature.color})`,
              border: `2px solid var(--pastel-${feature.color}-dark)`,
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: 'white',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <feature.icon size={36} style={{ color: `var(--accent-${feature.color})` }} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: `var(--accent-${feature.color})`,
                margin: '0 0 1rem 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.6'
              }}>
                {feature.story}
              </p>
              <div style={{
                padding: '0.75rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: `var(--accent-${feature.color})`,
                textAlign: 'center'
              }}>
                {feature.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotional CTA Section */}
      <div style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--pastel-coral) 0%, var(--pastel-pink) 50%, var(--pastel-lavender) 100%)',
        borderTop: '3px solid var(--pastel-coral-dark)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FiHeart size={24} style={{ color: 'var(--accent-coral)' }} />
        </div>
        
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.2'
        }}>
          You Don&apos;t Have to Face This Alone
        </h2>
        <p style={{
          fontSize: '1.5rem',
          color: 'var(--text-secondary)',
          margin: '0 0 3rem 0',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.5'
        }}>
          Join thousands who&apos;ve found comfort and clarity in understanding their health journey
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: '1.75rem 4rem',
            background: 'linear-gradient(135deg, var(--accent-coral) 0%, #ff5a7e 100%)',
            border: '3px solid var(--accent-coral)',
            borderRadius: '25px',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(255, 117, 143, 0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 117, 143, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 117, 143, 0.4)';
          }}
        >
          <FiHeart size={32} />
          Start Your Healing Journey
        </button>
        
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--text-muted)',
          margin: '2rem 0 0 0'
        }}>
          Free forever • No account required • Complete privacy
        </p>
      </div>

      {/* Footer */}
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{
          margin: 0,
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          © 2024 When I&apos;m Sick. Made with ❤️ for your health journey. For educational purposes only.
        </p>
      </div>
    </div>
  );
}