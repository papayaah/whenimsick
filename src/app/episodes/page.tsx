'use client';

import React from 'react';
import { getDeviceId } from '@/lib/utils';
import EpisodesLayout from '@/components/EpisodesLayout';

export default function EpisodesPage() {
  // Get deviceId synchronously to avoid loading delay
  const deviceId = getDeviceId();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
      height: '100%',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 5
    }}>
      {/* Episodes Layout */}
      <EpisodesLayout
        deviceId={deviceId}
        initialSelectedEpisodeId={null}
        initialSelectedEntryId={null}
      />
    </div>
  );
}
