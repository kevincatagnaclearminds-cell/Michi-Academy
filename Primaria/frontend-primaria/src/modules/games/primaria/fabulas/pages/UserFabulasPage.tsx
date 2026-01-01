import React, { useState } from 'react';
import { useFabulas } from '../hooks/useFabulas';
import { TabNavigator } from '../components/TabNavigator';
import { FabulaCard } from '../components/FabulaCard';
import { FabulaSidebar } from '../components/FabulaSidebar';
import { AudioPlayer } from '../components/AudioPlayer';
import { VideoPlayer } from '../components/VideoPlayer';
import { FabulaQuizComplete } from '../components/FabulaQuizComplete';
import { ExitQuizModal } from '../components/ExitQuizModal';
import { PointsDisplay } from '../components/PointsDisplay';
import './UserFabulasPage.css';

export const UserFabulasPage: React.FC = () => {
  const {
    fabulas,
    audiolibros,
    selectedFabula,
    setSelectedFabula,
    completedFabulas,
    viewedFabulas,
    points,
    markFabulaAsCompleted,
    handleFabulaSelect,
    addPoints
  } = useFabulas();

  const [activeTab, setActiveTab] = useState<'fabulas' | 'audiolibros'>('audiolibros');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingFabulaId, setPendingFabulaId] = useState<string | null>(null);

  const handleSelectFabula = (fabulaId: string) => {
    // Si hay un quiz en progreso, mostrar modal de confirmación
    if (showQuiz) {
      setPendingFabulaId(fabulaId);
      setShowExitModal(true);
      return;
    }
    
    handleFabulaSelect(fabulaId);
    setShowQuiz(false);
    
    // Determinar si es una fábula o un video basándose en en qué lista está
    const isFabula = fabulas.some(f => f.id === fabulaId);
    const isVideo = audiolibros.some(f => f.id === fabulaId);
    if (isFabula) {
      setActiveTab('fabulas');
    } else if (isVideo) {
      setActiveTab('audiolibros');
    }
  };

  const handleVideoComplete = () => {
    // Video marcado como visto
  };

  const handleQuizClick = () => {
      setShowQuiz(true);
  };

  const handleQuizQuestionAnswer = (questionIndex: number, isCorrect: boolean) => {
    // Los puntos se suman automáticamente en el componente del quiz
    // Esta función se puede usar para tracking adicional si es necesario
  };

  const handleQuizComplete = (totalPoints: number) => {
    addPoints(totalPoints);
    setShowQuiz(false);
    if (selectedFabula) {
      markFabulaAsCompleted(selectedFabula.id);
    }
  };

  const handleBackToList = () => {
    // Si hay un quiz en progreso, mostrar modal de confirmación
    if (showQuiz) {
      setShowExitModal(true);
      return;
    }
    
    setSelectedFabula(null);
    setShowQuiz(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (pendingFabulaId) {
      handleFabulaSelect(pendingFabulaId);
      setPendingFabulaId(null);
    } else {
      setSelectedFabula(null);
    }
    setShowQuiz(false);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingFabulaId(null);
  };

  // Vista de detalle de fábula
  if (selectedFabula) {
    // Determinar qué lista mostrar en el sidebar basándose en el tab activo
    const sidebarItems = activeTab === 'fabulas' ? fabulas : audiolibros;
    
    return (
      <div className="fabulas-page">
        <FabulaSidebar
          fabulas={sidebarItems}
          currentFabulaId={selectedFabula.id}
          onSelectFabula={handleSelectFabula}
          completedFabulas={completedFabulas}
          viewedFabulas={viewedFabulas}
        />

        <div className="fabulas-content fabula-detail-content">
          <div className="fabula-detail-header">
          <button className="back-button" onClick={handleBackToList}>
              ← Volver a {activeTab === 'fabulas' ? 'las fábulas' : 'los videos'}
          </button>
            <PointsDisplay points={points} />
          </div>

          <div className="fabula-detail-container">
            {!showQuiz ? (
              selectedFabula.videoUrl ? (
              <VideoPlayer 
                fabula={selectedFabula} 
                  onComplete={handleVideoComplete}
                  onQuizClick={handleQuizClick}
              />
            ) : (
              <AudioPlayer 
                fabula={selectedFabula} 
                  onComplete={handleVideoComplete}
              />
              )
            ) : selectedFabula.quiz && selectedFabula.quiz.length > 0 ? (
              <FabulaQuizComplete
                quiz={selectedFabula.quiz}
                onAnswer={handleQuizQuestionAnswer}
                onComplete={handleQuizComplete}
              />
            ) : null}
          </div>
        </div>

        <ExitQuizModal
          isOpen={showExitModal}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      </div>
    );
  }

  // Vista de lista de fábulas
  return (
    <div className="fabulas-page">
      <div className="fabulas-content">
        <div className="fabulas-header">
          <div className="fabulas-header-top">
            <div>
          <h1 className="fabulas-title">Fábulas y Videos Educativos</h1>
          <p className="fabulas-subtitle">
            Escucha estas increíbles fábulas y aprende valiosas lecciones
          </p>
            </div>
            <PointsDisplay points={points} />
          </div>
        </div>

        <TabNavigator 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          videosCompleted={audiolibros.filter(v => completedFabulas.has(v.id)).length}
          videosTotal={audiolibros.length}
          fabulasCompleted={fabulas.filter(f => completedFabulas.has(f.id)).length}
          fabulasTotal={fabulas.length}
        />

        <div className="fabulas-grid">
          {(activeTab === 'fabulas' ? fabulas : audiolibros).map((fabula) => (
            <FabulaCard
              key={fabula.id}
              fabula={fabula}
              onClick={() => handleSelectFabula(fabula.id)}
              isCompleted={completedFabulas.has(fabula.id)}
              isViewed={viewedFabulas.has(fabula.id)}
              isAudioLibro={activeTab === 'audiolibros'}
            />
          ))}
        </div>

        {(activeTab === 'fabulas' ? fabulas : audiolibros).length === 0 && (
          <div className="fabulas-empty">
            <p>No hay {activeTab === 'audiolibros' ? 'videos' : 'fábulas'} disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};
