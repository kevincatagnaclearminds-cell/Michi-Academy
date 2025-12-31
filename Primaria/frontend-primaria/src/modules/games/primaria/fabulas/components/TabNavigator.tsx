import React from 'react';
import './TabNavigator.css';

interface TabNavigatorProps {
  activeTab: 'fabulas' | 'audiolibros';
  onTabChange: (tab: 'fabulas' | 'audiolibros') => void;
  videosCompleted: number;
  videosTotal: number;
  fabulasCompleted: number;
  fabulasTotal: number;
}

export const TabNavigator: React.FC<TabNavigatorProps> = ({
  activeTab,
  onTabChange,
  videosCompleted,
  videosTotal,
  fabulasCompleted,
  fabulasTotal
}) => {
  return (
    <div className="tab-navigator">
      <button
        className={`tab-item ${activeTab === 'audiolibros' ? 'active' : ''}`}
        onClick={() => onTabChange('audiolibros')}
      >
        <span className="tab-label">Videos</span>
        <span className="tab-count">{videosCompleted}/{videosTotal}</span>
      </button>
      <button
        className={`tab-item ${activeTab === 'fabulas' ? 'active' : ''}`}
        onClick={() => onTabChange('fabulas')}
      >
        <span className="tab-label">Fábulas</span>
        <span className="tab-count">{fabulasCompleted}/{fabulasTotal}</span>
      </button>
    </div>
  );
};



