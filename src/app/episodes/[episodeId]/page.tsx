'use client';

import React, { useState, useEffect } from 'react';
import { getDeviceId } from '@/lib/utils';
import EpisodesLayout from '@/components/EpisodesLayout';

interface EpisodePageProps {
  params: Promise<{
    episodeId: string;
  }>;
}

export default function EpisodePage({ params }: EpisodePageProps) {
  const [episodeId, setEpisodeId] = useState<string>('');
  
  // Get deviceId synchronously to avoid loading delay
  const deviceId = getDeviceId();

  useEffect(() => {
    // Get episode ID from params
    const loadParams = async () => {
      const resolvedParams = await params;
      setEpisodeId(resolvedParams.episodeId);
    };
    loadParams();
  }, [params]);

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
        initialSelectedEpisodeId={episodeId}
        initialSelectedEntryId={null}
      />
    </div>
  );
}
