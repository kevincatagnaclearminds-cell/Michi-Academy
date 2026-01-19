import { Video, VideoCategory } from '../types/video.types';

export const mockVideos: Video[] = [
  {
    id: '1',
    title: '¿Qué es el dinero?',
    description: 'Aprende sobre el concepto básico del dinero',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    // Opción 1: Video local en public/videos/ → '/videos/nombre-del-video.mp4'
    // Opción 2: URL externa → 'https://ejemplo.com/video.mp4'
    // Opción 3: YouTube Shorts → 'https://www.youtube.com/shorts/VIDEO_ID'
    //          o YouTube normal → 'https://www.youtube.com/watch?v=VIDEO_ID'
    //          o YouTube corto → 'https://youtu.be/VIDEO_ID'
    url: 'https://youtube.com/shorts/NIcGRnMuPYU?si=ydEf06araIAF8WJL',
    category: 'Finanzas',
    duration: 60,
    keyConcepts: [
      'El dinero es un medio de intercambio que facilita las compras',
      'Se usa para comprar bienes (cosas) y servicios (trabajos)',
      'Puede ser físico como billetes y monedas, o digital como en el celular',
      'Tiene valor porque todos lo aceptan como forma de pago',
      'Antes del dinero se usaba el trueque (intercambiar cosas)',
      'El dinero nos ayuda a ahorrar para comprar cosas más grandes',
    ],
    quiz: {
      question: '¿Qué es el dinero?',
      options: [
        'Un juguete para coleccionar',
        'Un medio de intercambio para comprar cosas',
        'Solo billetes de papel',
        'Algo que solo usan los adultos'
      ],
      correctAnswer: 1
    },
  },
  {
    id: '2',
    title: 'Ahorrar es importante',
    description: 'Descubre por qué es importante ahorrar',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    url: 'https://youtube.com/shorts/2-HBo-EJit0?si=uEejhlCWYMWZpbbG',
    category: 'Finanzas',
    duration: 90,
    keyConcepts: [
      'Ahorrar significa guardar dinero para el futuro en lugar de gastarlo todo',
      'Nos ayuda a alcanzar metas importantes como comprar un juguete especial',
      'Debemos separar una parte de nuestros ingresos antes de gastar',
      'El ahorro nos da seguridad financiera para emergencias',
      'Podemos usar una alcancía o una cuenta de ahorros',
      'Ahorrar un poco cada día puede convertirse en mucho dinero',
      'Es mejor ahorrar primero y luego gastar lo que sobra',
    ],
    quiz: {
      question: '¿Por qué es importante ahorrar?',
      options: [
        'Para gastar todo el dinero rápido',
        'Para alcanzar metas y tener seguridad en el futuro',
        'Porque es aburrido gastarlo',
        'Solo los adultos deben ahorrar'
      ],
      correctAnswer: 1
    },
  },
  {
    id: '3',
    title: 'El valor del trabajo',
    description: 'Entiende cómo se gana el dinero',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    url: 'https://youtube.com/shorts/IjF-IHwNTNE?si=p1TiU6C5V4GfnatX',
    category: 'Finanzas',
    duration: 75,
    keyConcepts: [
      'El dinero se gana trabajando y haciendo tareas útiles',
      'Cada trabajo tiene un valor diferente según la dificultad',
      'Es importante esforzarse y ser responsable en lo que hacemos',
      'El trabajo nos permite obtener lo que necesitamos y queremos',
      'Los adultos trabajan para ganar dinero y mantener a sus familias',
      'Los niños pueden ayudar en casa y aprender sobre el valor del trabajo',
      'Trabajar duro nos hace sentir orgullosos y nos enseña responsabilidad',
    ],
    quiz: {
      question: '¿Cómo se gana el dinero?',
      options: [
        'Solo pidiendo a los padres',
        'Trabajando y haciendo tareas útiles',
        'El dinero aparece solo',
        'Jugando videojuegos'
      ],
      correctAnswer: 1
    },
  },
  {
    id: '4',
    title: 'Gastos y necesidades',
    description: 'Diferencia entre lo que necesitas y lo que quieres',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    url: 'https://youtube.com/shorts/uzlCJl3vvZo?si=HAkFxcAnvxXMwc2S',
    category: 'Finanzas',
    duration: 80,
    keyConcepts: [
      'Las necesidades son cosas esenciales para vivir: comida, ropa, casa',
      'Los deseos son cosas que queremos pero no necesitamos: juguetes, dulces',
      'Debemos priorizar las necesidades antes que los deseos',
      'Gastar con inteligencia nos ayuda a ahorrar para cosas importantes',
      'Preguntarnos "¿realmente lo necesito?" antes de comprar',
      'A veces podemos esperar antes de comprar algo que queremos',
      'Planificar nuestros gastos nos ayuda a tener más dinero para ahorrar',
    ],
    quiz: {
      question: '¿Cuál es la diferencia entre necesidad y deseo?',
      options: [
        'No hay diferencia, son lo mismo',
        'Las necesidades son esenciales para vivir, los deseos son cosas que queremos',
        'Los deseos son más importantes',
        'Solo los adultos tienen necesidades'
      ],
      correctAnswer: 1
    },
  },
  {
    id: '5',
    title: 'Matemáticas básicas',
    description: 'Suma y resta para niños',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    url: 'https://youtube.com/shorts/uS3qy377WuM?si=ZRz1gYjSihZenOtB',
    category: 'Matemáticas',
    duration: 120,
    keyConcepts: [
      'La suma es juntar cantidades para obtener un total mayor',
      'La resta es quitar o comparar cantidades para obtener la diferencia',
      'Practicar nos ayuda a mejorar y hacer cálculos más rápido',
      'Las matemáticas están en todo lo que hacemos: comprar, cocinar, jugar',
      'Podemos usar objetos o dibujos para entender mejor las operaciones',
      'La suma y resta son operaciones básicas que usamos todos los días',
      'Con práctica, las matemáticas se vuelven más fáciles y divertidas',
    ],
    quiz: {
      question: '¿Qué es la suma?',
      options: [
        'Quitar cantidades',
        'Juntar cantidades para obtener un total mayor',
        'Dividir en partes iguales',
        'No sirve para nada'
      ],
      correctAnswer: 1
    },
  },
  {
    id: '6',
    title: 'Multiplicación fácil',
    description: 'Aprende a multiplicar de forma divertida',
    // ⬇️ AQUÍ VA EL PATH DEL VIDEO ⬇️
    url: 'https://youtube.com/shorts/YdEE-4OzZ0E?si=LBHRQAWbmToMECCY',
    category: 'Matemáticas',
    duration: 100,
    keyConcepts: [
      'Multiplicar es sumar varias veces el mismo número de forma rápida',
      'Nos ayuda a calcular más rápido que sumar muchas veces',
      'Las tablas de multiplicar son muy útiles y debemos memorizarlas',
      'Con práctica se vuelve más fácil y podemos hacerlo mentalmente',
      'Por ejemplo: 3 x 4 = 12 es lo mismo que 4 + 4 + 4 = 12',
      'La multiplicación nos ayuda a contar grupos de cosas iguales',
      'Aprender las tablas nos hace más rápidos resolviendo problemas',
    ],
    quiz: {
      question: '¿Qué es la multiplicación?',
      options: [
        'Restar números',
        'Sumar varias veces el mismo número de forma rápida',
        'Solo sirve para números grandes',
        'Es más difícil que la división'
      ],
      correctAnswer: 1
    },
  },
];

export const getVideosByCategory = (): VideoCategory[] => {
  const categoriesMap = new Map<string, Video[]>();
  
  mockVideos.forEach((video) => {
    if (!categoriesMap.has(video.category)) {
      categoriesMap.set(video.category, []);
    }
    categoriesMap.get(video.category)!.push(video);
  });

  return Array.from(categoriesMap.entries()).map(([name, videos]) => ({
    name,
    videos,
  }));
};

