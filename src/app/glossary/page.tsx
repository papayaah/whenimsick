'use client';

import React from 'react';
import GlossaryContent from '@/components/GlossaryContent';

export default function GlossaryPage() {

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      height: '100vh', /* Full viewport height */
      minHeight: '100vh',
      position: 'relative',
      zIndex: 5
    }}>
      <GlossaryContent />
    </div>
  );
}
