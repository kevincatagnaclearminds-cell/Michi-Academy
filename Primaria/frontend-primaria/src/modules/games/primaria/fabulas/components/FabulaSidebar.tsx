import React from 'react';
import { Fabula } from '../types/fabula.types';
import './FabulaSidebar.css';

interface FabulaSidebarProps {
  fabulas: Fabula[];
  currentFabulaId: string;
  onSelectFabula: (fabulaId: string) => void;
  completedFabulas: Set<string>;
  viewedFabulas: Set<string>;
}

export const FabulaSidebar: React.FC<FabulaSidebarProps> = ({
  fabulas,
  currentFabulaId,
  onSelectFabula,
  completedFabulas,
  viewedFabulas
}) => {
  return (
    <div className="fabula-sidebar">
      <div className="fabula-sidebar-header">
        <h2 className="fabula-sidebar-title">Lista</h2>
      </div>

      <div className="fabula-sidebar-list">
        {fabulas.map((fabula) => {
          const isCurrent = fabula.id === currentFabulaId;
          const isCompleted = completedFabulas.has(fabula.id);
          const isViewed = viewedFabulas.has(fabula.id);

          return (
            <button
              key={fabula.id}
              className={`fabula-sidebar-item ${
                isCurrent ? 'active' : ''
              } ${isCompleted ? 'completed' : ''} ${isViewed ? 'viewed' : ''}`}
              onClick={() => onSelectFabula(fabula.id)}
            >
              <div className="fabula-sidebar-item-content">
                <div className="fabula-sidebar-item-header">
                  <span className="fabula-sidebar-item-icon">
                    {isCompleted ? '✓' : isViewed ? '👁️' : '○'}
                  </span>
                  <span className="fabula-sidebar-item-title">{fabula.title}</span>
                </div>
                <div className="fabula-sidebar-item-footer">
                  <span className="fabula-sidebar-item-duration">
                    {Math.floor((fabula.duration || 0) / 60)} min
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

