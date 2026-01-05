import React, { useState, useEffect, useRef } from 'react';
import { PhraseGame } from '../types/phrase.types';
import { WordCard } from './WordCard';
import { StarAnimation } from './StarAnimation';
import './PhraseOrderingGame.css';

interface PhraseOrderingGameProps {
  phraseGame: PhraseGame;
  onComplete: (isCorrect: boolean, timeSpent: number, pointsEarned: number) => void;
  points: number;
}

export const PhraseOrderingGame: React.FC<PhraseOrderingGameProps> = ({
  phraseGame,
  onComplete,
  points
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showStars, setShowStars] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  // Inicializar palabras
  useEffect(() => {
    const phraseWords = phraseGame.phrase
      .split(/\s+/)
      .filter(w => w.trim() !== '');
    setWords(phraseWords);
    
    const shuffled = [...phraseWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setIsCorrect(null);
    setStartTime(Date.now());
    setTimeSpent(0);
    setShowStars(false);
    setDraggedWord(null);
    setDragOverIndex(null);
  }, [phraseGame.id]);

  // Contador de tiempo
  useEffect(() => {
    if (isCorrect !== null) return;
    
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isCorrect]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcular puntos ganados
  const calculatePoints = (timeSpent: number): number => {
    if (timeSpent < 30) {
      return 15; // Bonus por rapidez
    } else if (timeSpent < 60) {
      return 12;
    }
    return 10;
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, word: string, source: 'available' | 'selected', index?: number) => {
    if (isCorrect !== null) {
      e.preventDefault();
      return;
    }
    setDraggedWord(word);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.setData('source', source);
    if (index !== undefined) {
      e.dataTransfer.setData('index', index.toString());
    }
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== undefined) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDropOnSelected = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCorrect !== null) return;

    const word = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    
    setDragOverIndex(null);

    if (source === 'available') {
      // Desde palabras disponibles hacia área seleccionada
      const newSelected = [...selectedWords];
      newSelected.splice(targetIndex, 0, word);
      setSelectedWords(newSelected);
      setShuffledWords(shuffledWords.filter(w => w !== word));
    } else if (source === 'selected') {
      // Reordenar dentro de seleccionadas
      const sourceIndex = parseInt(e.dataTransfer.getData('index'));
      if (sourceIndex !== targetIndex && !isNaN(sourceIndex)) {
        const newSelected = [...selectedWords];
        const [removed] = newSelected.splice(sourceIndex, 1);
        newSelected.splice(targetIndex, 0, removed);
        setSelectedWords(newSelected);
      }
    }
    
    setDraggedWord(null);
  };

  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCorrect !== null) return;

    const word = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    
    if (source === 'selected') {
      const sourceIndex = parseInt(e.dataTransfer.getData('index'));
      if (!isNaN(sourceIndex)) {
        const newSelected = [...selectedWords];
        newSelected.splice(sourceIndex, 1);
        setSelectedWords(newSelected);
        setShuffledWords([...shuffledWords, word]);
      }
    }
    
    setDraggedWord(null);
  };

  const handleDropOnEmptySelected = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCorrect !== null) return;

    const word = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    
    if (source === 'available') {
      setSelectedWords([...selectedWords, word]);
      setShuffledWords(shuffledWords.filter(w => w !== word));
    }
    
    setDraggedWord(null);
  };

  // Verificar orden automáticamente cuando todas las palabras están seleccionadas
  useEffect(() => {
    if (selectedWords.length === words.length && words.length > 0 && isCorrect === null) {
      const userPhrase = selectedWords.join(' ').toLowerCase().trim().replace(/\s+/g, ' ');
      const correctPhrase = words.join(' ').toLowerCase().trim().replace(/\s+/g, ' ');
      
      if (userPhrase === correctPhrase) {
        setIsCorrect(true);
        setShowStars(true);
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        setTimeSpent(finalTime);
        const pointsEarned = calculatePoints(finalTime);
        setTimeout(() => {
          onComplete(true, finalTime, pointsEarned);
        }, 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWords, words.length]);

  const handleReset = () => {
    if (isCorrect !== null) return;
    const allWords = [...selectedWords, ...shuffledWords];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setStartTime(Date.now());
    setTimeSpent(0);
    setShowStars(false);
  };

  const handleWordRemove = (index: number) => {
    if (isCorrect !== null) return;
    const word = selectedWords[index];
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, word]);
  };

  return (
    <div className="game-right-content">
      <div className="game-header-right">
            <div className="timer-display">
              <span className="timer-icon">⏱️</span>
              <span className="timer-label">Tiempo:</span>
              <span className="timer-value">{formatTime(timeSpent)}</span>
            </div>
          </div>

          <div className="selected-words-area">
            <p className="instruction-text">Arrastra las palabras aquí para ordenarlas:</p>
            <div 
              ref={selectedContainerRef}
              className={`selected-words-container ${selectedWords.length === 0 ? 'empty' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selectedWords.length === 0) {
                  handleDragOver(e);
                }
              }}
              onDrop={selectedWords.length === 0 ? handleDropOnEmptySelected : undefined}
            >
              {selectedWords.length === 0 ? (
                <div className="empty-words-placeholder">
                  Suelta las palabras aquí
                </div>
              ) : (
                selectedWords.map((word, index) => {
                  const isCorrectPosition = index < words.length && word === words[index];
                  return (
                    <div
                      key={`selected-${index}-${word}`}
                      className={`word-slot ${dragOverIndex === index ? 'drag-over' : ''} ${isCorrectPosition && selectedWords.length === words.length && isCorrect ? 'correct-position' : ''}`}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDropOnSelected(e, index)}
                    >
                      <WordCard
                        word={word}
                        isSelected={true}
                        isDragging={draggedWord === word}
                        isCorrect={isCorrectPosition && selectedWords.length === words.length && isCorrect === true}
                        onClick={() => handleWordRemove(index)}
                        onDragStart={(e) => handleDragStart(e, word, 'selected', index)}
                        onDragEnd={handleDragEnd}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="available-words-area">
            <p className="instruction-text">Palabras disponibles:</p>
            <div 
              className="available-words-container"
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOver(e);
              }}
              onDragLeave={handleDragLeave}
              onDrop={handleDropOnAvailable}
            >
              {shuffledWords.map((word, index) => (
                <WordCard
                  key={`available-${index}-${word}`}
                  word={word}
                  isSelected={false}
                  isDragging={draggedWord === word}
                  onClick={() => {
                    if (isCorrect === null) {
                      const newSelected = [...selectedWords, word];
                      setSelectedWords(newSelected);
                      setShuffledWords(shuffledWords.filter(w => w !== word));
                    }
                  }}
                  onDragStart={(e) => handleDragStart(e, word, 'available')}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          </div>

          <div className="game-actions">
            <button 
              className="action-btn reset-btn"
              onClick={handleReset}
              disabled={selectedWords.length === 0 || isCorrect !== null}
            >
              🔄 Reiniciar
            </button>
          </div>

      {showStars && (
        <div className="stars-wrapper">
          <StarAnimation show={showStars} />
        </div>
      )}
    </div>
  );
};
