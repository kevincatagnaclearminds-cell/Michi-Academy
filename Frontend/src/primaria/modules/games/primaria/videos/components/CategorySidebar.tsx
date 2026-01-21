import React, { useState } from 'react';
import { VideoCategory, Video } from '../types/video.types';
import { PointsProgress } from './PointsProgress';
import './CategorySidebar.css';

interface CategorySidebarProps {
  categories: VideoCategory[];
  selectedCategory: string;
  selectedVideoId?: string;
  watchedVideos: Set<string>;
  points?: number;
  maxPoints?: number;
  onCategorySelect: (categoryName: string) => void;
  onVideoSelect?: (videoId: string, categoryName: string) => void;
  onQuizSelect?: (categoryName: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  selectedVideoId,
  watchedVideos,
  points = 0,
  maxPoints = 200,
  onCategorySelect,
  onVideoSelect,
  onQuizSelect,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set([selectedCategory])
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleCategoryClick = (categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedCategories.has(categoryName)) {
      onCategorySelect(categoryName);
    } else {
      toggleCategory(categoryName);
    }
  };

  const handleVideoClick = (video: Video, categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVideoSelect) {
      onVideoSelect(video.id, categoryName);
    } else {
      onCategorySelect(categoryName);
    }
  };

  return (
    <div className="category-sidebar">
      <h2>Categorías</h2>
      
      {/* Componente de puntos */}
      <PointsProgress points={points} maxPoints={maxPoints} />
      
      <div className="category-list">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.name);
          const isActive = selectedCategory === category.name;
          const watchedCount = category.videos.filter((v) => watchedVideos.has(v.id)).length;

          return (
            <div key={category.name} className="category-accordion">
              <div
                className={`category-header ${isActive ? 'active' : ''}`}
                onClick={() => toggleCategory(category.name)}
              >
                <div className="category-header-content">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {watchedCount}/{category.videos.length}
                  </span>
                </div>
                <i
                  className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} category-chevron`}
                ></i>
              </div>

              {isExpanded && (
                <>
                  <div className="category-videos">
                    {category.videos.map((video) => {
                      const isWatched = watchedVideos.has(video.id);
                      const isCurrentVideo = selectedVideoId === video.id;

                      return (
                        <div
                          key={video.id}
                          className={`video-item ${isCurrentVideo ? 'current' : ''} ${
                            isWatched ? 'watched' : ''
                          }`}
                          onClick={(e) => handleVideoClick(video, category.name, e)}
                        >
                          <div className="video-item-content">
                            <div className="video-status-icon">
                              {isWatched ? (
                                <i className="fas fa-check-circle watched-icon"></i>
                              ) : (
                                <i className="fas fa-circle not-watched-icon"></i>
                              )}
                            </div>
                            <span className="video-title">{video.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {category.videos.length > 0 && onQuizSelect && (
                    <div 
                      className={`quiz-item ${watchedCount === category.videos.length ? 'quiz-available' : 'quiz-locked'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuizSelect(category.name);
                      }}
                    >
                      <div className="quiz-item-content">
                        <div className="quiz-icon">
                          {watchedCount === category.videos.length ? (
                            <i className="fas fa-question-circle"></i>
                          ) : (
                            <i className="fas fa-lock"></i>
                          )}
                        </div>
                        <span className="quiz-title">Resolver Quiz</span>
                        <i className="fas fa-arrow-right quiz-arrow"></i>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

