import { useState, useEffect } from 'react';
import { PhraseGame } from '../types/phrase.types';
import { mockPhrases } from '../data/mockPhrases';

export const usePhrases = () => {
  const [phrases] = useState<PhraseGame[]>(mockPhrases);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedPhrases');
    if (savedCompleted) {
      setCompletedPhrases(new Set(JSON.parse(savedCompleted)));
    }

    const savedPoints = localStorage.getItem('phrasePoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('completedPhrases', JSON.stringify([...completedPhrases]));
  }, [completedPhrases]);

  useEffect(() => {
    localStorage.setItem('phrasePoints', points.toString());
  }, [points]);

  const markPhraseAsCompleted = (phraseId: string, timeSpent?: number) => {
    setCompletedPhrases((prev) => new Set([...prev, phraseId]));
    // Más puntos si es más rápido (bonus por tiempo)
    let pointsToAdd = 10;
    if (timeSpent && timeSpent < 30) {
      pointsToAdd = 15; // Bonus por rapidez
    } else if (timeSpent && timeSpent < 60) {
      pointsToAdd = 12;
    }
    setPoints((prev) => prev + pointsToAdd);
  };

  const nextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  };

  const previousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    }
  };

  const selectPhrase = (phraseId: string) => {
    const index = phrases.findIndex(p => p.id === phraseId);
    if (index !== -1) {
      setCurrentPhraseIndex(index);
    }
  };

  return {
    phrases,
    currentPhrase: phrases[currentPhraseIndex],
    currentPhraseIndex,
    completedPhrases,
    points,
    markPhraseAsCompleted,
    nextPhrase,
    previousPhrase,
    selectPhrase
  };
};

