'use client';

import React, { useState } from 'react';
import { storageService } from '@/services/storageService';

interface StorageStatsData {
  episodeCount: number;
  entryCount: number;
  storageUsed: string;
}

export default function StorageStats() {
  const [stats, setStats] = useState<StorageStatsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const storageStats = await storageService.getStorageStats();
      setStats(storageStats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    if (!isVisible && !stats) {
      loadStats();
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = await storageService.exportData();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whenimsick-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const jsonData = e.target?.result as string;
        await storageService.importData(jsonData);
        await loadStats(); // Refresh stats after import
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = async () => {
    if (
      confirm(
        'Are you sure you want to clear all stored data? This action cannot be undone.'
      )
    ) {
      try {
        await storageService.clearCollection('episodes');
        await storageService.clearCollection('symptom_entries');
        await storageService.clearCollection('glossary');
        await loadStats();
        alert('All data cleared successfully');
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('Failed to clear data');
      }
    }
  };

  return (
    <div className='storage-stats-container'>
      <button className='storage-stats-toggle' onClick={handleToggleVisibility}>
        {isVisible ? '▼' : '▶'} Storage & Data
      </button>

      {isVisible && (
        <div className='storage-stats-content'>
          {loading ? (
            <div className='loading-container'>
              <div className='loading-spinner' />
              <span>Loading storage stats...</span>
            </div>
          ) : stats ? (
            <div className='stats-grid'>
              <div className='stat-item'>
                <span className='stat-label'>Episodes:</span>
                <span className='stat-value'>{stats.episodeCount}</span>
              </div>
              <div className='stat-item'>
                <span className='stat-label'>Entries:</span>
                <span className='stat-value'>{stats.entryCount}</span>
              </div>
              <div className='stat-item'>
                <span className='stat-label'>Storage Used:</span>
                <span className='stat-value'>{stats.storageUsed}</span>
              </div>
            </div>
          ) : null}

          <div className='storage-actions'>
            <button
              className='btn-secondary'
              onClick={handleExportData}
              disabled={!stats || stats.episodeCount === 0}
            >
              📤 Export Data
            </button>

            <label className='btn-secondary import-btn'>
              📥 Import Data
              <input
                type='file'
                accept='.json'
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>

            <button
              className='btn-danger'
              onClick={handleClearAllData}
              disabled={!stats || stats.episodeCount === 0}
            >
              🗑️ Clear All Data
            </button>
          </div>

          <div className='storage-info'>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              * Data is stored locally in your browser. Clearing browser data
              will remove all episodes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
