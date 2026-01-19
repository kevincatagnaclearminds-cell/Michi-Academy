import React from 'react';
import { ActiveTab } from '../types';
import './TabNavigator.css';

interface TabNavigatorProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'sources' as ActiveTab, label: '📚 Investigar', icon: '📚' },
    { id: 'calculator' as ActiveTab, label: '🧮 Calcular', icon: '🧮' },
    { id: 'justification' as ActiveTab, label: '📋 Justificar', icon: '📋' },
  ];

  return (
    <div className="tab-navigator">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(activeTab === tab.id ? null : tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label.replace(/^[^\s]+\s/, '')}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigator;

