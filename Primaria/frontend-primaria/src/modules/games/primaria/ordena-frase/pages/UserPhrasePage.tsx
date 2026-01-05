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

  const handleComplete = (isCorrect: boolean, timeSpent: number, pointsEarned: number) => {
    if (isCorrect && currentPhrase) {
      setPointsEarned(pointsEarned);
      markPhraseAsCompleted(currentPhrase.id, timeSpent);
      setShowVictory(true);
    }
  };

  const handleNextPhrase = () => {
    setShowVictory(false);
    nextPhrase();
  };

  if (!currentPhrase && phrases.length > 0) {
    // Si no hay frase actual, usar la primera
    return (
      <div className="phrase-page">
        <div className="phrase-content">
          <PhraseOrderingGame
            phraseGame={phrases[0]}
            onComplete={handleComplete}
            points={points}
          />
        </div>
      </div>
    );
  }

  if (!currentPhrase) {
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
                <h2 className="phrase-title">{currentPhrase.title}</h2>
                <p className="phrase-text">{currentPhrase.phrase}</p>
              </div>

              <div className="media-section">
                <MediaPlayer
                  audioUrl={currentPhrase.audioUrl}
                  videoUrl={currentPhrase.videoUrl}
                  title={currentPhrase.title}
                  text={currentPhrase.phrase}
                />
              </div>

              {currentPhrase.hint && (
                <div className="hint-section">
                  <button 
                    className="hint-btn-left"
                    onClick={() => alert(currentPhrase.hint)}
                  >
                    💡 Pista
                  </button>
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
                phraseGame={currentPhrase}
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
