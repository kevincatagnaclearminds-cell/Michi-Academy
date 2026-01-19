import React, { useState, useEffect } from 'react';
import { getVideosByCategory } from '../data/mockVideos';
import { getQuizByCategory } from '../data/mockQuizzes';
import { VideoCategory } from '../types/video.types';
import { CategorySidebar } from '../components/CategorySidebar';
import { TikTokVideoPlayer } from '../components/TikTokVideoPlayer';
import { VideoCompletion } from '../components/VideoCompletion';
import { VideoConcepts } from '../components/VideoConcepts';
import { VideoQuiz } from '../components/VideoQuiz';
import { CategoryQuiz } from '../components/CategoryQuiz';
import { QuizLockedMessage } from '../components/QuizLockedMessage';
import './UserVideosPage.css';

export const UserVideosPage: React.FC = () => {
  const [categories] = useState<VideoCategory[]>(getVideosByCategory());
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ''
  );
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConceptsOpen, setIsConceptsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [points, setPoints] = useState(0);
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<string>>(new Set());

  const currentCategory = categories.find((cat) => cat.name === selectedCategory);
  const currentVideos = currentCategory?.videos || [];
  const currentVideo = currentVideos[currentVideoIndex];
  
  // Calcular puntos máximos (10 puntos por cada video con quiz)
  const maxPoints = categories.reduce((total, cat) => {
    return total + cat.videos.filter(v => v.quiz).length * 10;
  }, 0);

  // Guardar puntos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('userPoints', points.toString());
  }, [points]);

  // Guardar quizzes respondidos en localStorage
  useEffect(() => {
    localStorage.setItem('answeredQuizzes', JSON.stringify([...answeredQuizzes]));
  }, [answeredQuizzes]);

  useEffect(() => {
    setCurrentVideoIndex(0);
    setIsCompleted(false);
  }, [selectedCategory]);

  // Detectar tamaño de pantalla y ajustar visibilidad
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
        setIsConceptsOpen(false);
      } else {
        setIsSidebarOpen(true);
        setIsConceptsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    // Cerrar el quiz si está abierto
    setShowQuiz(false);
    setSelectedCategory(categoryName);
    // Mostrar conceptos en desktop
    if (!isMobile) {
      setIsConceptsOpen(true);
    }
  };

  const handleVideoSelect = (videoId: string, categoryName: string) => {
    // Cerrar el quiz si está abierto
    setShowQuiz(false);
    
    setSelectedCategory(categoryName);
    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      const videoIndex = category.videos.findIndex((v) => v.id === videoId);
      if (videoIndex !== -1) {
        setCurrentVideoIndex(videoIndex);
        setIsCompleted(false);
      }
    }
    // Ocultar sidebar y conceptos en móvil después de seleccionar video
    if (isMobile) {
      setIsSidebarOpen(false);
      setIsConceptsOpen(false);
    } else {
      // Mostrar conceptos en desktop cuando se selecciona un video
      setIsConceptsOpen(true);
    }
  };

  const handleVideoWatched = (videoId: string) => {
    setWatchedVideos((prev) => {
      if (!prev.has(videoId)) {
        return new Set([...prev, videoId]);
      }
      return prev;
    });
  };

  const handleVideoEnd = () => {
    if (currentVideo) {
      setWatchedVideos((prev) => new Set([...prev, currentVideo.id]));
    }
    if (currentVideoIndex < currentVideos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < currentVideos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
      setIsCompleted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRepeat = () => {
    setCurrentVideoIndex(0);
    setIsCompleted(false);
  };

  const handleGoToQuiz = (categoryName?: string) => {
    if (categoryName) {
      setSelectedCategory(categoryName);
    }
    setShowQuiz(true);
    // Ocultar conceptos cuando se muestra el quiz o mensaje
    setIsConceptsOpen(false);
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect && currentVideo) {
      const quizKey = currentVideo.id;
      // Solo dar puntos si no ha respondido este quiz antes
      if (!answeredQuizzes.has(quizKey)) {
        setPoints((prev) => prev + 10); // 10 puntos por respuesta correcta
        setAnsweredQuizzes((prev) => new Set([...prev, quizKey]));
      }
    }
  };

  const handleBackFromQuiz = () => {
    setShowQuiz(false);
    setIsCompleted(false);
    // Volver a mostrar conceptos en desktop
    if (!isMobile) {
      setIsConceptsOpen(true);
    }
  };

  const currentQuiz = showQuiz ? getQuizByCategory(selectedCategory) : null;
  const currentCategoryWatchedCount = currentCategory 
    ? currentCategory.videos.filter((v) => watchedVideos.has(v.id)).length 
    : 0;
  const allVideosWatched = currentCategory 
    ? currentCategoryWatchedCount === currentCategory.videos.length 
    : false;

  if (categories.length === 0) {
    return (
      <div className="user-videos-page">
        <p>No hay videos disponibles</p>
      </div>
    );
  }

  return (
    <div className={`user-videos-page ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isConceptsOpen ? 'concepts-open' : 'concepts-closed'}`}>
      {isMobile && (
        <>
          <button
            className="mobile-toggle mobile-toggle-sidebar"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              if (!isSidebarOpen) setIsConceptsOpen(false);
            }}
            aria-label={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            <i className="fas fa-list"></i>
          </button>
          <button
            className="mobile-toggle mobile-toggle-concepts"
            onClick={() => {
              setIsConceptsOpen(!isConceptsOpen);
              if (!isConceptsOpen) setIsSidebarOpen(false);
            }}
            aria-label={isConceptsOpen ? 'Ocultar conceptos' : 'Mostrar conceptos'}
          >
            <i className="fas fa-lightbulb"></i>
          </button>
        </>
      )}
      <div className="videos-layout">
        <aside className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
          <CategorySidebar
            categories={categories}
            selectedCategory={selectedCategory}
            selectedVideoId={currentVideo?.id}
            watchedVideos={watchedVideos}
            points={points}
            maxPoints={maxPoints}
            onCategorySelect={handleCategorySelect}
            onVideoSelect={handleVideoSelect}
            onQuizSelect={handleGoToQuiz}
          />
        </aside>

        <main className="video-main-content">
          {showQuiz ? (
            allVideosWatched && currentQuiz ? (
              <CategoryQuiz quiz={currentQuiz} onBack={handleBackFromQuiz} />
            ) : currentCategory ? (
              <QuizLockedMessage
                watchedCount={currentCategoryWatchedCount}
                totalVideos={currentCategory.videos.length}
                categoryName={selectedCategory}
                onBack={handleBackFromQuiz}
              />
            ) : null
          ) : isCompleted ? (
            <VideoCompletion onRepeat={handleRepeat} onGoToQuiz={() => handleGoToQuiz()} />
          ) : currentVideo ? (
            <TikTokVideoPlayer
              video={currentVideo}
              videoIndex={currentVideoIndex}
              totalVideos={currentVideos.length}
              onVideoEnd={handleVideoEnd}
              onPreviousVideo={handlePreviousVideo}
              onNextVideo={handleNextVideo}
              onVideoWatched={handleVideoWatched}
            />
          ) : (
            <p>No hay videos en esta categoría</p>
          )}
        </main>

        <aside className={`concepts-container ${isConceptsOpen && !showQuiz ? 'open' : 'closed'}`}>
          {currentVideo && !isCompleted && !showQuiz && (
            <>
              <VideoConcepts key={currentVideo.id} video={currentVideo} />
              {currentVideo.quiz && (
                <VideoQuiz 
                  question={currentVideo.quiz.question}
                  options={currentVideo.quiz.options}
                  correctAnswer={currentVideo.quiz.correctAnswer}
                  onAnswer={handleQuizAnswer}
                />
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

