'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

export default function TermsOfUsePage() {
  const router = useRouter();

  return (
    <div className='app-container-fullwidth'>
      <div className='app-main-content-fullwidth'>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e9ecef',
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              padding: '0.5rem',
              marginRight: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MdArrowBack size={24} color='#495057' />
          </button>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: '400',
              color: '#212529',
              margin: 0,
            }}
          >
            Terms of Use
          </h1>
        </div>

        <div
          style={{
            flex: 1,
            padding: '1.25rem',
            paddingTop: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            Terms of Use
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6c757d',
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontStyle: 'italic',
            }}
          >
            Last updated: January 2025
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              1. Acceptance of Terms
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              By accessing and using this application (&quot;When I&apos;m
              Sick&quot;), you accept and agree to be bound by the terms and
              provision of this agreement.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              2. Medical Disclaimer
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              This application is designed for general health information and
              symptom tracking purposes only. It is not intended to:
            </p>
            <ul
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
                paddingLeft: '1rem',
              }}
            >
              <li style={{ marginBottom: '0.5rem' }}>
                Diagnose, treat, cure, or prevent any disease
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Replace professional medical advice, diagnosis, or treatment
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Provide emergency medical services
              </li>
            </ul>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical
              condition.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              3. Use of the Application
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              You agree to use this application only for lawful purposes and in
              accordance with these Terms of Use. You agree not to:
            </p>
            <ul
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
                paddingLeft: '1rem',
              }}
            >
              <li style={{ marginBottom: '0.5rem' }}>
                Use the app for any unlawful purpose or to solicit others to
                perform unlawful acts
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Violate any international, federal, provincial, or state
                regulations, rules, laws, or local ordinances
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Transmit any worms, viruses, or any code of a destructive nature
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Infringe upon or violate our intellectual property rights or the
                intellectual property rights of others
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              4. Data and Privacy
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              Your health data is stored locally on your device and is not
              transmitted to external servers without your explicit consent.
              Please review our Privacy Policy for detailed information about
              data collection, use, and protection.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              5. Limitation of Liability
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              In no event shall <span className="brand-font">When I&apos;m Sick</span>, nor its directors,
              employees, partners, agents, suppliers, or affiliates, be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your use of
              the application.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.75rem',
              }}
            >
              6. Changes to Terms
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              We reserve the right to modify or replace these Terms of Use at
              any time. If a revision is material, we will try to provide at
              least 30 days notice prior to any new terms taking effect.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1.25rem',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                color: '#212529',
                marginBottom: '0.5rem',
              }}
            >
              Contact Information
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                margin: 0,
              }}
            >
              If you have any questions about these Terms of Use, please contact
              us through the app&apos;s support features.
            </p>
          </div>

          <p
            style={{
              fontSize: '0.75rem',
              color: '#adb5bd',
              textAlign: 'center',
              lineHeight: '1.5',
              marginTop: '1.5rem',
              marginBottom: '1rem',
              padding: '0 1.25rem',
            }}
          >
            This app provides general health information only and is not
            intended to diagnose, treat, cure, or prevent any disease. Always
            consult with a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
