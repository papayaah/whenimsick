'use client';

import React, { useState } from 'react';

interface TabLayoutProps {
  children: React.ReactNode;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function TabLayout({
  tabs,
  defaultTab,
  onTabChange,
}: TabLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className='tab-layout'>
      {/* Tab Navigation */}
      <div className='tab-navigation'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className='tab-icon'>{tab.icon}</span>
            <span className='tab-label'>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='tab-content'>{activeTabContent}</div>
    </div>
  );
}
