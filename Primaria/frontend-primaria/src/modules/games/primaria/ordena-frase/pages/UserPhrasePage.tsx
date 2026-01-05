import React, { useState } from 'react';
import { usePhrases } from '../hooks/usePhrases';
import { PhraseOrderingGame } from '../components/PhraseOrderingGame';
import { VictoryScreen } from '../components/VictoryScreen';
import { MediaPlayer } from '../components/MediaPlayer';
import { PointsDisplay } from '../../fabulas/components/PointsDisplay';
import './UserPhrasePage.css';

export const UserPhrasePage: React.FC = () => {
  const {
    phrases,
    currentPhrase,
    points,
    markPhraseAsCompleted,
    nextPhrase
  } = usePhrases();

  const [showVictory, setShowVictory] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Determinar frase activa (fallback a la primera si no hay actual pero hay lista)
  const activePhrase = currentPhrase || (phrases.length > 0 ? phrases[0] : null);

  // Resetear pista al cambiar de frase
  React.useEffect(() => {
    setShowHint(false);
  }, [activePhrase?.id]);

  const handleComplete = (isCorrect: boolean, timeSpent: number, pointsEarned: number) => {
    if (isCorrect && activePhrase) {
      setPointsEarned(pointsEarned);
      markPhraseAsCompleted(activePhrase.id, timeSpent);
      setShowVictory(true);
    }
  };

  const handleNextPhrase = () => {
    setShowVictory(false);
    setShowHint(false); // Asegurar reset
    nextPhrase();
  };

  if (!activePhrase) {
    return (
      <div className="phrase-page">
        <div className="phrase-content">
          <div className="phrases-empty">
            <p>No hay frases disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phrase-page">
      <div className="phrase-content">
        <div className="phrase-game-container">
          {/* Columna Izquierda: Siempre visible */}
          <div className="game-left-column">
            <div className="game-left-content">
              <div className="phrase-display">
                <h2 className="phrase-title">{activePhrase.title}</h2>
                <p className="phrase-text">{activePhrase.phrase}</p>
              </div>

              <div className="media-section">
                <MediaPlayer
                  audioUrl={activePhrase.audioUrl}
                  videoUrl={activePhrase.videoUrl}
                  title={activePhrase.title}
                  text={activePhrase.phrase}
                />
              </div>

              {activePhrase.hint && (
                <div className="hint-section">
                  {!showHint ? (
                    <button 
                      className="hint-btn-left"
                      onClick={() => setShowHint(true)}
                    >
                      💡 Pista
                    </button>
                  ) : (
                    <div className="hint-display fade-in">
                      <p className="hint-text">💡 {activePhrase.hint}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="points-section">
                <PointsDisplay points={points} />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Juego o Pantalla de Victoria */}
          <div className="game-right-column">
            {showVictory ? (
              <VictoryScreen 
                points={pointsEarned} 
                onNext={handleNextPhrase}
              />
            ) : (
              <PhraseOrderingGame
                phraseGame={activePhrase}
                onComplete={handleComplete}
                points={points}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
