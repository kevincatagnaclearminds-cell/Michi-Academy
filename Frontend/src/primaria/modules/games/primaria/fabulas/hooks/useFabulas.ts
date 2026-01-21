import { useState, useEffect } from 'react';
import { Fabula } from '../types/fabula.types';
import { mockFabulas, mockAudiolibros } from '../data/mockFabulas';

export const useFabulas = () => {
  const [fabulas] = useState<Fabula[]>(mockFabulas);
  const [audiolibros] = useState<Fabula[]>(mockAudiolibros);
  const [allFabulas] = useState<Fabula[]>([...mockFabulas, ...mockAudiolibros]);
  const [selectedFabula, setSelectedFabula] = useState<Fabula | null>(null);
  const [completedFabulas, setCompletedFabulas] = useState<Set<string>>(new Set());
  const [viewedFabulas, setViewedFabulas] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState(0);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedFabulas');
    if (savedCompleted) {
      setCompletedFabulas(new Set(JSON.parse(savedCompleted)));
    }

    const savedViewed = localStorage.getItem('viewedFabulas');
    if (savedViewed) {
      setViewedFabulas(new Set(JSON.parse(savedViewed)));
    }

    const savedPoints = localStorage.getItem('fabulasPoints');
    if (savedPoints) {
      setPoints(parseInt(savedPoints, 10));
    }
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem('completedFabulas', JSON.stringify([...completedFabulas]));
  }, [completedFabulas]);

  useEffect(() => {
    localStorage.setItem('viewedFabulas', JSON.stringify([...viewedFabulas]));
  }, [viewedFabulas]);

  useEffect(() => {
    localStorage.setItem('fabulasPoints', points.toString());
  }, [points]);

  const markFabulaAsViewed = (fabulaId: string) => {
    setViewedFabulas((prev) => new Set([...prev, fabulaId]));
  };

  const markFabulaAsCompleted = (fabulaId: string) => {
    setCompletedFabulas((prev) => new Set([...prev, fabulaId]));
    markFabulaAsViewed(fabulaId);
  };

  const handleQuizAnswer = (fabulaId: string, isCorrect: boolean) => {
    if (isCorrect) {
      setPoints((prev) => prev + 10);
      markFabulaAsCompleted(fabulaId);
    }
  };

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount);
  };

  const handleFabulaSelect = (fabulaId: string) => {
    const fabula = allFabulas.find((f) => f.id === fabulaId);
    if (fabula) {
      setSelectedFabula(fabula);
      markFabulaAsViewed(fabulaId);
    }
  };

  return {
    allFabulas,
    fabulas,
    audiolibros,
    selectedFabula,
    setSelectedFabula,
    completedFabulas,
    viewedFabulas,
    points,
    handleQuizAnswer,
    markFabulaAsCompleted,
    handleFabulaSelect,
    addPoints
  };
};

