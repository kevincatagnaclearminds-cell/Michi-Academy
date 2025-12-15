import { Quiz, Question } from '../../quiz-individual/types/quiz.types';

export const mockQuizzes: Record<string, Quiz> = {
  Finanzas: {
    id: 'quiz-finanzas-1',
    title: 'Quiz de Finanzas',
    questions: [
      {
        id: 'q-finanzas-1',
        question: '¿Qué es el dinero?',
        options: [
          'Un objeto que solo tiene valor físico',
          'Un medio de intercambio que facilita las compras',
          'Solo billetes y monedas',
          'Algo que no tiene valor'
        ],
        correctAnswer: 1,
        explanation: 'El dinero es un medio de intercambio que facilita las compras y transacciones.'
      },
      {
        id: 'q-finanzas-2',
        question: '¿Cuál es la mejor forma de ahorrar?',
        options: [
          'Gastar todo el dinero de inmediato',
          'Guardar el dinero en un lugar seguro y no gastarlo en cosas innecesarias',
          'Pedir prestado siempre',
          'No ahorrar nunca'
        ],
        correctAnswer: 1,
        explanation: 'Ahorrar significa guardar dinero en un lugar seguro y evitar gastos innecesarios.'
      },
      {
        id: 'q-finanzas-3',
        question: '¿Qué diferencia hay entre necesidades y deseos?',
        options: [
          'No hay diferencia',
          'Las necesidades son esenciales para vivir, los deseos son cosas que queremos pero no necesitamos',
          'Los deseos son más importantes que las necesidades',
          'Solo existen los deseos'
        ],
        correctAnswer: 1,
        explanation: 'Las necesidades son cosas esenciales como comida y ropa, mientras que los deseos son cosas que queremos pero no necesitamos.'
      },
      {
        id: 'q-finanzas-4',
        question: '¿Por qué es importante el trabajo?',
        options: [
          'No es importante',
          'El trabajo nos permite ganar dinero para comprar lo que necesitamos',
          'Solo los adultos trabajan',
          'El trabajo no tiene relación con el dinero'
        ],
        correctAnswer: 1,
        explanation: 'El trabajo nos permite ganar dinero que podemos usar para comprar las cosas que necesitamos y queremos.'
      },
      {
        id: 'q-finanzas-5',
        question: '¿Qué significa gastar con inteligencia?',
        options: [
          'Gastar todo el dinero de una vez',
          'Pensar antes de comprar y priorizar las necesidades sobre los deseos',
          'Nunca gastar dinero',
          'Comprar solo cosas caras'
        ],
        correctAnswer: 1,
        explanation: 'Gastar con inteligencia significa pensar antes de comprar y priorizar las necesidades sobre los deseos.'
      }
    ]
  },
  Matemáticas: {
    id: 'quiz-matematicas-1',
    title: 'Quiz de Matemáticas',
    questions: [
      {
        id: 'q-matematicas-1',
        question: '¿Cuánto es 5 + 3?',
        options: [
          '6',
          '7',
          '8',
          '9'
        ],
        correctAnswer: 2,
        explanation: '5 + 3 = 8'
      },
      {
        id: 'q-matematicas-2',
        question: '¿Cuánto es 4 × 2?',
        options: [
          '6',
          '7',
          '8',
          '9'
        ],
        correctAnswer: 2,
        explanation: '4 × 2 = 8. La multiplicación es sumar el mismo número varias veces.'
      },
      {
        id: 'q-matematicas-3',
        question: 'Si tengo 10 manzanas y como 3, ¿cuántas me quedan?',
        options: [
          '5',
          '6',
          '7',
          '8'
        ],
        correctAnswer: 2,
        explanation: '10 - 3 = 7. Me quedan 7 manzanas.'
      },
      {
        id: 'q-matematicas-4',
        question: '¿Cuánto es 2 × 5?',
        options: [
          '8',
          '9',
          '10',
          '11'
        ],
        correctAnswer: 2,
        explanation: '2 × 5 = 10'
      },
      {
        id: 'q-matematicas-5',
        question: 'Si tengo 15 dulces y doy 6 a mi amigo, ¿cuántos me quedan?',
        options: [
          '7',
          '8',
          '9',
          '10'
        ],
        correctAnswer: 2,
        explanation: '15 - 6 = 9. Me quedan 9 dulces.'
      }
    ]
  }
};

export const getQuizByCategory = (categoryName: string): Quiz | null => {
  return mockQuizzes[categoryName] || null;
};

