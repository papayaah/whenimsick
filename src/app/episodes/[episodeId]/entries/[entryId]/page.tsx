'use client';

import React, { useState, useEffect } from 'react';
import { getDeviceId } from '@/lib/utils';
import EpisodesLayout from '@/components/EpisodesLayout';

interface EntryPageProps {
  params: Promise<{
    episodeId: string;
    entryId: string;
  }>;
}

export default function EntryPage({ params }: EntryPageProps) {
  const [deviceId, setDeviceId] = useState<string>('');
  const [episodeId, setEpisodeId] = useState<string>('');
  const [entryId, setEntryId] = useState<string>('');

  useEffect(() => {
    setDeviceId(getDeviceId());

    // Get episode and entry IDs from params
    const loadParams = async () => {
      const resolvedParams = await params;
      setEpisodeId(resolvedParams.episodeId);
      setEntryId(resolvedParams.entryId);
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
      {deviceId && (
        <EpisodesLayout
          deviceId={deviceId}
          initialSelectedEpisodeId={episodeId}
          initialSelectedEntryId={entryId}
        />
      )}
    </div>
  );
}
