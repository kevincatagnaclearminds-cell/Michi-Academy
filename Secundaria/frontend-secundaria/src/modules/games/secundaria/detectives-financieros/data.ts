import { Company } from './types';

export const companies: Company[] = [
    {
        id: '1',
        name: 'TechNova Solutions',
        description: 'Startup tecnológica enfocada en IA para agricultura. Fundada hace 2 años, busca inversión para expandir operaciones.',
        interestRate: 7.5,
        riskLevel: 'Alto',
        sector: 'Tecnología',
        investmentAmount: 10000,
        investmentPeriod: 2,
        informationSources: [
            {
                id: 'src1-1',
                name: 'Superintendencia de Compañías, Valores y Seguros',
                type: 'confiable',
                description: 'Reporte oficial que muestra pérdidas en los últimos 2 años y alto endeudamiento.',
                reliability: 98
            },
            {
                id: 'src1-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src1-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src1-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src1-5',
                name: 'Superintendencia de Compañías, Valores y Seguros - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r1-1',
                text: 'La empresa tiene pérdidas documentadas en registros oficiales',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r1-2',
                text: 'La tasa de interés es atractiva (7.5%)',
                isCorrect: false,
                category: 'rentabilidad'
            },
            {
                id: 'r1-3',
                text: 'Es una startup sin historial de rentabilidad comprobado',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r1-4',
                text: 'El nivel de riesgo es alto según registros oficiales',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r1-5',
                text: 'La información proviene de fuentes confiables (registros oficiales)',
                isCorrect: true,
                category: 'fuente'
            }
        ]
    },
    {
        id: '2',
        name: 'Banco Seguro',
        description: 'Institución bancaria con 50 años de trayectoria. Regulada por la Superintendencia Financiera.',
        interestRate: 4.2,
        riskLevel: 'Bajo',
        sector: 'Finanzas',
        investmentAmount: 15000,
        investmentPeriod: 3,
        informationSources: [
            {
                id: 'src2-1',
                name: 'Superintendencia de Bancos',
                type: 'confiable',
                description: 'Regulador oficial que certifica la solvencia y estabilidad del banco.',
                reliability: 100
            },
            {
                id: 'src2-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src2-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src2-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            }
        ],
        verifiableReasons: [
            {
                id: 'r2-1',
                text: 'Regulado y supervisado por autoridad financiera oficial',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r2-2',
                text: 'Tasa de interés baja pero segura (4.2%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r2-3',
                text: 'Nivel de riesgo bajo según calificadoras reconocidas',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r2-4',
                text: '50 años de historial comprobado de estabilidad',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r2-5',
                text: 'La tasa es muy baja comparada con otras opciones',
                isCorrect: false,
                category: 'rentabilidad'
            }
        ]
    },
    {
        id: '3',
        name: 'EcoEnergy Corp',
        description: 'Empresa de paneles solares en expansión regional. 5 años en el mercado con crecimiento constante.',
        interestRate: 6.0,
        riskLevel: 'Medio',
        sector: 'Energía',
        investmentAmount: 12000,
        investmentPeriod: 2,
        informationSources: [
            {
                id: 'src3-1',
                name: 'Superintendencia de Compañías, Valores y Seguros',
                type: 'confiable',
                description: 'Reporte oficial que muestra el estado financiero de la empresa.',
                reliability: 98
            },
            {
                id: 'src3-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src3-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src3-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src3-5',
                name: 'Superintendencia de Compañías, Valores y Seguros - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r3-1',
                text: 'Tasa de interés moderada y razonable (6%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r3-2',
                text: 'Riesgo medio, balanceado con rentabilidad',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r3-3',
                text: 'Historial de 5 años con crecimiento documentado',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r3-4',
                text: 'Información verificable de fuentes oficiales',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r3-5',
                text: 'Sector en crecimiento según estudios oficiales',
                isCorrect: true,
                category: 'historial'
            }
        ]
    },
    {
        id: '4',
        name: 'CryptoFast',
        description: 'Plataforma de intercambio de criptomonedas nueva. Promete altos retornos rápidos.',
        interestRate: 12.0,
        riskLevel: 'Alto',
        sector: 'Finanzas',
        investmentAmount: 8000,
        investmentPeriod: 1,
        informationSources: [
            {
                id: 'src4-1',
                name: 'Superintendencia de Bancos',
                type: 'confiable',
                description: 'Advertencia oficial sobre plataformas no reguladas de criptomonedas.',
                reliability: 100
            },
            {
                id: 'src4-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src4-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src4-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src4-5',
                name: 'Superintendencia de Bancos - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r4-1',
                text: 'Tasa de interés extremadamente alta (12%) es sospechosa',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r4-2',
                text: 'No regulada por autoridades financieras oficiales',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r4-3',
                text: 'Múltiples quejas documentadas de usuarios',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r4-4',
                text: 'Riesgo muy alto según advertencias oficiales',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r4-5',
                text: 'La alta tasa de interés garantiza buenos retornos',
                isCorrect: false,
                category: 'rentabilidad'
            }
        ]
    },
    {
        id: '5',
        name: 'Constructora Solida',
        description: 'Desarrolladora inmobiliaria con proyectos estatales. 15 años de experiencia en construcción.',
        interestRate: 5.8,
        riskLevel: 'Bajo',
        sector: 'Construcción',
        investmentAmount: 20000,
        investmentPeriod: 3,
        informationSources: [
            {
                id: 'src5-1',
                name: 'Superintendencia de Compañías, Valores y Seguros',
                type: 'confiable',
                description: 'Reporte oficial que muestra el estado financiero de la empresa.',
                reliability: 98
            },
            {
                id: 'src5-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src5-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src5-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src5-5',
                name: 'Superintendencia de Compañías, Valores y Seguros - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r5-1',
                text: 'Contratos activos con el estado verificables',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r5-2',
                text: 'Tasa de interés moderada y razonable (5.8%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r5-3',
                text: 'Riesgo bajo con respaldo de contratos estatales',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r5-4',
                text: '15 años de historial documentado',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r5-5',
                text: 'Información de fuentes oficiales verificables',
                isCorrect: true,
                category: 'fuente'
            }
        ]
    },
    {
        id: '6',
        name: 'Bonos del Tesoro',
        description: 'Bonos emitidos por el gobierno nacional. Considerados la inversión más segura del país.',
        interestRate: 3.5,
        riskLevel: 'Bajo',
        sector: 'Gobierno',
        investmentAmount: 25000,
        investmentPeriod: 5,
        informationSources: [
            {
                id: 'src6-1',
                name: 'Ministerio de Hacienda',
                type: 'confiable',
                description: 'Emisión oficial de bonos gubernamentales con respaldo del estado.',
                reliability: 100
            },
            {
                id: 'src6-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src6-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src6-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src6-5',
                name: 'Ministerio de Hacienda - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado del Ministerio en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r6-1',
                text: 'Emitidos por el gobierno con respaldo estatal',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r6-2',
                text: 'Riesgo mínimo, la inversión más segura disponible',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r6-3',
                text: 'Tasa baja pero garantizada (3.5%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r6-4',
                text: 'Historial de pago puntual del gobierno',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r6-5',
                text: 'La tasa es muy baja comparada con otras opciones',
                isCorrect: false,
                category: 'rentabilidad'
            }
        ]
    },
    {
        id: '7',
        name: 'StartUp Fantasma',
        description: 'Empresa sin historial claro prometiendo retornos imposibles. Contacto solo por WhatsApp.',
        interestRate: 20.0,
        riskLevel: 'Alto',
        sector: 'Desconocido',
        investmentAmount: 5000,
        investmentPeriod: 1,
        informationSources: [
            {
                id: 'src7-1',
                name: 'Superintendencia de Compañías, Valores y Seguros',
                type: 'confiable',
                description: 'No se encuentra registro oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src7-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src7-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src7-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src7-5',
                name: 'Superintendencia de Compañías, Valores y Seguros - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r7-1',
                text: 'No registrada en registros oficiales',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r7-2',
                text: 'Tasa de interés imposiblemente alta (20%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r7-3',
                text: 'Patrón similar a estafas documentadas',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r7-4',
                text: 'Riesgo extremadamente alto, posible estafa',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r7-5',
                text: 'La alta tasa garantiza excelentes ganancias',
                isCorrect: false,
                category: 'rentabilidad'
            }
        ]
    },
    {
        id: '8',
        name: 'Cooperativa El Ahorro',
        description: 'Cooperativa local con buen respaldo de socios. 10 años operando en la región.',
        interestRate: 5.5,
        riskLevel: 'Medio',
        sector: 'Finanzas',
        investmentAmount: 10000,
        investmentPeriod: 2,
        informationSources: [
            {
                id: 'src8-1',
                name: 'Superintendencia de Bancos',
                type: 'confiable',
                description: 'Registro oficial que muestra operación regulada y estable.',
                reliability: 95
            },
            {
                id: 'src8-2',
                name: 'SRI - Servicio de Rentas Internas',
                type: 'confiable',
                description: 'Información fiscal oficial de la empresa.',
                reliability: 100
            },
            {
                id: 'src8-3',
                name: 'Función Judicial',
                type: 'confiable',
                description: 'Registro judicial oficial de casos legales pendientes.',
                reliability: 100
            },
            {
                id: 'src8-4',
                name: 'Redes sociales del CEO',
                type: 'no-confiable',
                description: 'Publicaciones del CEO en redes sociales sin verificación oficial.'
            },
            {
                id: 'src8-5',
                name: 'Superintendencia de Bancos - Redes Sociales',
                type: 'confiable',
                description: 'Post oficial verificado de la Superintendencia en redes sociales.',
                reliability: 100
            }
        ],
        verifiableReasons: [
            {
                id: 'r8-1',
                text: 'Regulada por superintendencia oficial',
                isCorrect: true,
                category: 'fuente'
            },
            {
                id: 'r8-2',
                text: 'Tasa de interés moderada (5.5%)',
                isCorrect: true,
                category: 'rentabilidad'
            },
            {
                id: 'r8-3',
                text: 'Riesgo medio, balanceado',
                isCorrect: true,
                category: 'riesgo'
            },
            {
                id: 'r8-4',
                text: '10 años de operación documentada',
                isCorrect: true,
                category: 'historial'
            },
            {
                id: 'r8-5',
                text: 'Información verificable de fuentes oficiales',
                isCorrect: true,
                category: 'fuente'
            }
        ]
    }
];
