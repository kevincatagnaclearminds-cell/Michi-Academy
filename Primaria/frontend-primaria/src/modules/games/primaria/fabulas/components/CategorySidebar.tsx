import React from 'react';
import { FabulaCategory } from '../types/fabula.types';
import './CategorySidebar.css';

interface CategorySidebarProps {
  categories: FabulaCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isOpen,
  onToggle
}) => {
  return (
    <>
      <button 
        className="category-sidebar-toggle"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div className={`category-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="category-sidebar-header">
          <h2 className="category-sidebar-title">📚 Categorías</h2>
        </div>

        <div className="category-sidebar-list">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`category-item ${
                selectedCategory === category.name ? 'active' : ''
              }`}
              onClick={() => onSelectCategory(category.name)}
            >
              <span className="category-icon">{category.icon || '📖'}</span>
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-count">
                  {category.fabulas.length} fábula{category.fabulas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <div 
          className="category-sidebar-overlay"
          onClick={onToggle}
        />
      )}
    </>
  );
};










