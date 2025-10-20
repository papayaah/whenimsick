'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBack } from 'react-icons/md';

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
            Privacy Policy
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

          <div
            style={{
              backgroundColor: '#e7f3ff',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '0.75rem',
              marginBottom: '0.75rem',
              borderLeft: '4px solid #007bff',
            }}
          >
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                fontWeight: '500',
                margin: 0,
              }}
            >
              🔒 Your health data stays on your device by default. We only
              collect data you explicitly choose to share for AI analysis.
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
              1. Information We Collect
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>Health Data:</strong> Symptoms, notes, and health entries
              you create are stored locally on your device. This data is only
              transmitted to our AI analysis service when you explicitly choose
              to analyze your symptoms.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>Usage Data:</strong> We may collect anonymous usage
              statistics to improve the app, such as which features are used
              most frequently.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>Device Information:</strong> Basic device information
              (device type, operating system version) to ensure compatibility.
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
              2. How We Use Your Information
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              We use your information to:
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
                Provide AI-powered health insights when you request them
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Improve app functionality and user experience
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Ensure app compatibility with your device
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Provide customer support when needed
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
              3. Data Storage and Security
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>Local Storage:</strong> Your health data is primarily
              stored locally on your device using secure, encrypted local
              databases.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>AI Analysis:</strong> When you choose to analyze symptoms,
              your data is temporarily transmitted to our secure AI service
              provider. This data is processed for analysis and then deleted
              from our servers.
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              <strong>Security:</strong> We implement appropriate technical and
              organizational measures to protect your personal information
              against unauthorized access, alteration, disclosure, or
              destruction.
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
              4. Data Sharing
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              We do not sell, trade, or otherwise transfer your personal
              information to third parties, except:
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
                When you explicitly consent to share data for AI analysis
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                To comply with legal obligations
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                To protect our rights and prevent fraud
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                With trusted service providers who assist in app operations
                (under strict confidentiality agreements)
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
              5. Your Rights
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              You have the right to:
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
                Access your personal data stored in the app
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Delete your data at any time
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Export your health data
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Opt out of data collection for analytics
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Request information about how your data is used
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
              6. Data Retention
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              Your health data remains on your device until you choose to delete
              it. Data sent for AI analysis is deleted from our servers
              immediately after processing. Anonymous usage statistics may be
              retained for up to 2 years for app improvement purposes.
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
              7. Children&apos;s Privacy
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              Our app is not intended for children under 13 years of age. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
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
              8. Changes to This Policy
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                marginBottom: '0.75rem',
              }}
            >
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy in the
              app and updating the &quot;Last updated&quot; date. We encourage
              you to review this Privacy Policy periodically.
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
              Contact Us
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#495057',
                lineHeight: '1.43',
                margin: 0,
              }}
            >
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us through the app&apos;s support
              features.
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
