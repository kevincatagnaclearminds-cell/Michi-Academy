import { Fabula, FabulaCategory } from '../types/fabula.types';

// Fábulas (con videoUrl - videos de YouTube)
export const mockFabulas: Fabula[] = [
  {
    id: 'fabula-1',
    title: 'El Caldero Mágico',
    description: 'Una historia mágica y fascinante sobre un caldero especial. ¡Descubre qué secretos contiene!',
    videoUrl: 'https://youtu.be/MfLTjavmQGE?si=i2awwy4_PDxYQnTF',
    coverImage: '/images/fabulas/caldero-magico.jpg',
    duration: 720, // 12 minutos
    category: 'Magia',
    moral: 'La magia de las historias nos enseña lecciones valiosas sobre la vida.',
    characters: ['Personajes de la fábula'],
    keyConcepts: [
      'El valor de la imaginación',
      'Las historias nos conectan con lecciones importantes',
      'La magia del aprendizaje a través del entretenimiento'
    ],
    quiz: [
      {
      question: '¿Qué te pareció la historia del caldero mágico?',
      options: [
        'Fue aburrida',
        'Fue fascinante y emocionante',
        'No me gustó',
        'No sé'
      ],
      correctAnswer: 1
      },
      {
        question: '¿Cuál es la lección principal de esta historia?',
        options: [
          'Que no debemos confiar en la magia',
          'Que las historias nos enseñan lecciones valiosas',
          'Que todo es mentira',
          'Que no debemos leer'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Qué elemento mágico aparece en la historia?',
        options: [
          'Una varita mágica',
          'Un caldero mágico',
          'Un libro encantado',
          'Una piedra mágica'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Qué valor aprendemos de esta fábula?',
        options: [
          'La importancia de la magia',
          'El valor de la imaginación y las historias',
          'Que debemos evitar la fantasía',
          'Que todo es posible con magia'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Cómo nos ayudan las historias según esta fábula?',
        options: [
          'Nos entretienen solamente',
          'Nos conectan con lecciones importantes',
          'Nos confunden',
          'Nos hacen perder el tiempo'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'fabula-2',
    title: 'Fábula 2',
    description: 'Disfruta de esta increíble historia',
    videoUrl: 'https://youtu.be/kws9_Wm8DMU?si=sK9DPCCdrNkeU2JW',
    coverImage: undefined,
    duration: 600,
    category: 'Fábulas',
    moral: 'Las historias nos enseñan valiosas lecciones.',
    characters: [],
    keyConcepts: []
  },
  {
    id: 'fabula-3',
    title: 'Fábula 3',
    description: 'Disfruta de esta increíble historia',
    videoUrl: 'https://youtu.be/jeDiUEaHuRM?si=klV9Fc64QcuendsU',
    coverImage: undefined,
    duration: 600,
    category: 'Fábulas',
    moral: 'Las historias nos enseñan valiosas lecciones.',
    characters: [],
    keyConcepts: []
  },
  {
    id: 'fabula-4',
    title: 'Fábula 4',
    description: 'Disfruta de esta increíble historia',
    videoUrl: 'https://youtu.be/FmisFJpCim0?si=VNacj8AwzMiIjSrB',
    coverImage: undefined,
    duration: 600,
    category: 'Fábulas',
    moral: 'Las historias nos enseñan valiosas lecciones.',
    characters: [],
    keyConcepts: []
  },
  {
    id: 'fabula-5',
    title: 'Fábula 5',
    description: 'Disfruta de esta increíble historia',
    videoUrl: 'https://youtu.be/euo8Ao0KWQo?si=tS0PMQPLcgb-Y1c5',
    coverImage: undefined,
    duration: 600,
    category: 'Fábulas',
    moral: 'Las historias nos enseñan valiosas lecciones.',
    characters: [],
    keyConcepts: []
  }
];

// Audiolibros/Videos (videos de educación financiera)
export const mockAudiolibros: Fabula[] = [
  {
    id: 'video-1',
    title: 'Introducción a la Educación Financiera',
    description: 'Aprende los conceptos básicos de la educación financiera y por qué es importante ahorrar.',
    videoUrl: 'https://youtu.be/VIDEO_ID_1', // TODO: Reemplazar con link real cuando esté disponible
    coverImage: undefined,
    duration: 600,
    category: 'Educación Financiera',
    moral: 'La educación financiera es fundamental para tomar decisiones inteligentes con nuestro dinero.',
    characters: [],
    keyConcepts: [
      'Qué es el dinero y cómo funciona',
      'La importancia de ahorrar',
      'Cómo hacer un presupuesto básico',
      'Diferencias entre necesidades y deseos'
    ],
    quiz: [
      {
        question: '¿Qué es la educación financiera?',
        options: [
          'Aprender a gastar todo el dinero',
          'Conocer cómo manejar nuestro dinero de forma inteligente',
          'Solo saber contar billetes',
          'No tiene importancia'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Por qué es importante ahorrar?',
        options: [
          'Para tener dinero para emergencias',
          'Para alcanzar nuestras metas futuras',
          'Para no gastar en cosas innecesarias',
          'Todas las anteriores'
        ],
        correctAnswer: 3
      },
      {
        question: '¿Qué es un presupuesto?',
        options: [
          'Una lista de cosas que queremos comprar',
          'Un plan para gastar nuestro dinero',
          'Solo dinero que sobra',
          'Algo complicado que solo usan los adultos'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Cuál es la diferencia entre una necesidad y un deseo?',
        options: [
          'No hay diferencia',
          'Las necesidades son básicas para vivir, los deseos son cosas que queremos pero no necesitamos',
          'Los deseos son más importantes',
          'Solo los adultos tienen necesidades'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Qué debemos hacer antes de comprar algo?',
        options: [
          'Comprar de inmediato',
          'Pensar si realmente lo necesitamos y si tenemos dinero',
          'Pedir prestado siempre',
          'No pensar en nada'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'video-2',
    title: 'Ahorro y Planificación',
    description: 'Descubre cómo crear un plan de ahorro y alcanzar tus metas financieras paso a paso.',
    videoUrl: 'https://youtu.be/VIDEO_ID_2', // TODO: Reemplazar con link real cuando esté disponible
    coverImage: undefined,
    duration: 720,
    category: 'Educación Financiera',
    moral: 'Con disciplina y planificación, podemos alcanzar cualquier meta financiera que nos propongamos.',
    characters: [],
    keyConcepts: [
      'Cómo crear metas de ahorro',
      'El poder de ahorrar poco a poco',
      'Diferentes formas de ahorrar',
      'Cómo evitar gastos innecesarios'
    ],
    quiz: [
      {
        question: '¿Por qué es importante tener metas de ahorro?',
        options: [
          'No es importante',
          'Nos ayuda a mantenernos enfocados y motivados',
          'Solo los adultos necesitan metas',
          'Es muy difícil hacerlo'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Qué significa "ahorrar poco a poco"?',
        options: [
          'Ahorrar todo de una vez',
          'Ahorrar pequeñas cantidades regularmente',
          'No ahorrar nunca',
          'Solo ahorrar cuando sobra dinero'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Cuál es una buena forma de ahorrar?',
        options: [
          'Gastar todo el dinero',
          'Guardar una parte de nuestro dinero en un lugar seguro',
          'No pensar en el futuro',
          'Pedir siempre más dinero'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Cómo podemos evitar gastos innecesarios?',
        options: [
          'Comprar todo lo que vemos',
          'Pensar antes de comprar si realmente lo necesitamos',
          'Seguir a otros sin pensar',
          'No hay forma de evitarlos'
        ],
        correctAnswer: 1
      },
      {
        question: '¿Qué aprendemos sobre la planificación financiera?',
        options: [
          'Que es muy complicada',
          'Que nos ayuda a alcanzar nuestros objetivos',
          'Que no sirve para nada',
          'Que solo funciona para algunos'
        ],
        correctAnswer: 1
      }
    ]
  }
];

export const getFabulasByCategory = (): FabulaCategory[] => {
  const categories: { [key: string]: Fabula[] } = {};

  mockFabulas.forEach((fabula) => {
    if (!categories[fabula.category]) {
      categories[fabula.category] = [];
    }
    categories[fabula.category].push(fabula);
  });

  const categoryDescriptions: { [key: string]: string } = {
    'Magia': 'Historias mágicas y fascinantes con lecciones valiosas',
    'Fábulas': 'Historias en formato de video con lecciones valiosas'
  };

  return Object.keys(categories).map((categoryName) => ({
    name: categoryName,
    description: categoryDescriptions[categoryName] || '',
    fabulas: categories[categoryName],
    icon: getCategoryIcon(categoryName)
  }));
};

const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    'Magia': '✨',
    'Fábulas': '📚'
  };
  return icons[category] || '📚';
};

