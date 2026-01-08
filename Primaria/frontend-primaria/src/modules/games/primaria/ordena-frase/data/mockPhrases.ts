import { PhraseGame } from '../types/phrase.types';

export const mockPhrases: PhraseGame[] = [
  {
    id: 'phrase-1',
    title: 'Ahorrar es importante',
    phrase: 'Ahorrar es importante para el futuro',
    audioUrl: '/audios/frases/ahorrar-es-importante.mp3', // TODO: Agregar audio real
    category: 'Educación Financiera',
    difficulty: 'facil',
    hint: 'Piensa en qué debemos hacer con nuestro dinero'
  },
  {
    id: 'phrase-2',
    title: 'El valor del dinero',
    phrase: 'El dinero no crece en los árboles',
    audioUrl: '/audios/frases/dinero-arboles.mp3', // TODO: Agregar audio real
    category: 'Refranes',
    difficulty: 'medio',
    hint: 'Un refrán sobre cómo conseguir dinero'
  },
  {
    id: 'phrase-3',
    title: 'Presupuesto familiar',
    phrase: 'Debemos hacer un presupuesto cada mes',
    audioUrl: '/audios/frases/presupuesto-mensual.mp3', // TODO: Agregar audio real
    category: 'Educación Financiera',
    difficulty: 'medio'
  }
];







