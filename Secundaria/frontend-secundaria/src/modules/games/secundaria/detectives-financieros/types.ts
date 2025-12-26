export interface InformationSource {
    id: string;
    name: string;
    type: 'confiable' | 'no-confiable';
    description: string;
    reliability: number; // 0-100, solo para fuentes confiables
}

export interface VerifiableReason {
    id: string;
    text: string;
    isCorrect: boolean; // Si esta razón es válida para justificar la decisión
    category: 'rentabilidad' | 'riesgo' | 'fuente' | 'historial';
}

export interface Company {
    id: string;
    name: string;
    description: string;
    interestRate: number; // Percentage, e.g., 5.5
    riskLevel: 'Bajo' | 'Medio' | 'Alto';
    sector: string;
    investmentAmount: number; // Monto de inversión sugerido
    investmentPeriod: number; // Período en años para calcular interés simple
    informationSources: InformationSource[]; // Fuentes disponibles para investigar
    verifiableReasons: VerifiableReason[]; // Razones que el estudiante puede seleccionar
}

export type ActiveTab = 'sources' | 'calculator' | 'justification' | null;

export interface SourceJustification {
    sourceType: 'superintendencia' | 'sri' | 'judicial' | 'google' | 'redes' | 'banco';
    selectedAnswer: string | null;
    isCorrect: boolean | null;
}

export interface GameState {
    score: number;
    lives: number;
    currentCompanyIndex: number;
    isGameOver: boolean;
    feedback: {
        show: boolean;
        isCorrect: boolean;
        message: string;
    } | null;
    selectedSources: string[]; // IDs de fuentes seleccionadas
    calculatedReturn: number | null; // Retorno calculado por el estudiante
    selectedReasons: string[]; // IDs de razones seleccionadas (deprecated)
    sourceJustifications: SourceJustification[]; // Justificaciones por fuente
    selectedRiskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa' | null; // Nivel de riesgo seleccionado
    activeTab: ActiveTab; // Tab activo actual
    casosResueltos: number; // Número de casos resueltos
    capital: number; // Capital monetario del detective
}
