import { useState, useEffect } from 'react';
import { Company, GameState, ActiveTab, SourceJustification } from '../types';
import { companies } from '../data';

// Función para obtener respuestas correctas
const getCorrectAnswer = (sourceType: SourceJustification['sourceType'], company: Company): string => {
    const isHighRisk = company.riskLevel === 'Alto';
    
    switch (sourceType) {
        case 'superintendencia':
            return isHighRisk 
                ? 'Empresa con pérdidas y alto endeudamiento'
                : 'Empresa con ganancias estables';
        case 'sri':
            return isHighRisk
                ? 'Empresa con deudas fiscales pendientes'
                : 'Empresa al día con sus obligaciones fiscales';
        case 'judicial':
            return isHighRisk
                ? 'Casos legales pendientes'
                : 'Sin casos legales pendientes';
        case 'google':
            return isHighRisk
                ? 'Reseñas mayormente negativas'
                : 'Reseñas mayormente positivas';
        case 'redes':
            return isHighRisk
                ? 'Información no confiable con muchos bots'
                : 'Información confiable y verificada';
        case 'banco':
            return isHighRisk
                ? 'Empresa no registrada o sin licencia'
                : 'Empresa registrada y con licencia vigente';
        default:
            return '';
    }
};

// Función para obtener fuentes disponibles según el sector
const getAvailableSources = (company: Company): SourceJustification['sourceType'][] => {
    const baseSources: SourceJustification['sourceType'][] = [
        'superintendencia',
        'sri',
        'judicial',
        'google',
        'redes'
    ];
    
    // Banco Central removido de las opciones de justificación
    
    return baseSources;
};

// Función para inicializar justificaciones
const initializeJustifications = (company: Company): SourceJustification[] => {
    return getAvailableSources(company).map(sourceType => ({
        sourceType,
        selectedAnswer: null,
        isCorrect: null
    }));
};

export const useFinancialDetective = (initialCaseIndex?: number, gameCasesList?: Company[]) => {
    const INITIAL_CAPITAL = 100000; // Capital inicial del detective
    
    // Usar la lista de casos del juego si está disponible, sino usar todos los casos
    const casesToUse = gameCasesList && gameCasesList.length > 0 ? gameCasesList : companies;
    
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        lives: 3,
        currentCompanyIndex: initialCaseIndex !== undefined ? initialCaseIndex : 0,
        isGameOver: false,
        feedback: null,
        selectedSources: [],
        calculatedReturn: null,
        selectedReasons: [],
        sourceJustifications: [],
        selectedRiskLevel: null,
        activeTab: null,
        casosResueltos: 0,
        capital: INITIAL_CAPITAL,
    });

    const currentCompany = casesToUse[gameState.currentCompanyIndex];
    
    // Reinicializar cuando cambie el índice inicial o la lista de casos
    useEffect(() => {
        const casesToUseEffect = gameCasesList && gameCasesList.length > 0 ? gameCasesList : companies;
        if (initialCaseIndex !== undefined && initialCaseIndex !== gameState.currentCompanyIndex) {
            const company = casesToUseEffect[initialCaseIndex];
            setGameState({
                score: 0,
                lives: 3,
                currentCompanyIndex: initialCaseIndex,
                isGameOver: false,
                feedback: null,
                selectedSources: [],
                calculatedReturn: null,
                selectedReasons: [],
                sourceJustifications: company ? initializeJustifications(company) : [],
                selectedRiskLevel: null,
                activeTab: null,
                casosResueltos: 0,
                capital: INITIAL_CAPITAL,
            });
        }
    }, [initialCaseIndex, gameCasesList]);
    
    // Inicializar justificaciones si no existen o si cambió la empresa
    useEffect(() => {
        const casesToUseEffect = gameCasesList && gameCasesList.length > 0 ? gameCasesList : companies;
        const currentCompanyEffect = casesToUseEffect[gameState.currentCompanyIndex];
        if (currentCompanyEffect) {
            const availableSources = getAvailableSources(currentCompanyEffect);
            const currentSources = gameState.sourceJustifications.map(j => j.sourceType);
            const needsUpdate = availableSources.length !== currentSources.length || 
                               !availableSources.every(s => currentSources.includes(s));
            
            if (needsUpdate) {
                setGameState(prev => ({
                    ...prev,
                    sourceJustifications: initializeJustifications(currentCompanyEffect),
                    selectedRiskLevel: null
                }));
            }
        }
    }, [gameState.currentCompanyIndex, gameCasesList]);

    const calculateSimpleInterest = (principal: number, rate: number, period: number): number => {
        return principal + (principal * (rate / 100) * period);
    };

    const toggleSource = (sourceId: string) => {
        setGameState(prev => ({
            ...prev,
            selectedSources: prev.selectedSources.includes(sourceId)
                ? prev.selectedSources.filter(id => id !== sourceId)
                : [...prev.selectedSources, sourceId]
        }));
    };

    const setCalculatedReturn = (returnValue: number) => {
        setGameState(prev => ({
            ...prev,
            calculatedReturn: returnValue
        }));
    };

    const toggleReason = (reasonId: string) => {
        setGameState(prev => ({
            ...prev,
            selectedReasons: prev.selectedReasons.includes(reasonId)
                ? prev.selectedReasons.filter(id => id !== reasonId)
                : [...prev.selectedReasons, reasonId]
        }));
    };

    const setSourceJustification = (sourceType: SourceJustification['sourceType'], answer: string) => {
        if (!currentCompany) return;
        
        const correctAnswer = getCorrectAnswer(sourceType, currentCompany);
        const isCorrect = answer === correctAnswer;
        
        setGameState(prev => ({
            ...prev,
            sourceJustifications: prev.sourceJustifications.map(j => 
                j.sourceType === sourceType 
                    ? { ...j, selectedAnswer: answer, isCorrect }
                    : j
            )
        }));
    };

    const setRiskLevel = (riskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa') => {
        setGameState(prev => ({
            ...prev,
            selectedRiskLevel: riskLevel
        }));
    };

    const isJustificationComplete = (): boolean => {
        if (!currentCompany) return false;
        const availableSources = getAvailableSources(currentCompany);
        return availableSources.every(sourceType => {
            const justification = gameState.sourceJustifications.find(j => j.sourceType === sourceType);
            return justification?.selectedAnswer !== null && justification?.selectedAnswer !== undefined;
        }) && gameState.selectedRiskLevel !== null;
    };

    const setActiveTab = (tab: ActiveTab) => {
        setGameState(prev => ({
            ...prev,
            activeTab: tab
        }));
    };

    const checkInvestment = (invest: boolean) => {
        if (!currentCompany) return;

        // Verificar que la justificación esté completa
        if (!isJustificationComplete()) {
            setGameState(prev => ({
                ...prev,
                activeTab: 'justification'
            }));
            return;
        }

        // Lógica mejorada: Factible si:
        // - Tasa > 5% Y riesgo NO es 'Alto'
        // - O si es bono gubernamental (riesgo bajo aunque tasa baja)
        const isFeasible = 
            (currentCompany.interestRate > 5 && currentCompany.riskLevel !== 'Alto') ||
            (currentCompany.sector === 'Gobierno' && currentCompany.riskLevel === 'Bajo');

        // Verificar si la decisión es correcta
        const decisionCorrect = (invest && isFeasible) || (!invest && !isFeasible);

        // Verificar fuentes seleccionadas (deben ser principalmente confiables)
        const selectedSourcesData = currentCompany.informationSources.filter(
            src => gameState.selectedSources.includes(src.id)
        );
        const reliableSources = selectedSourcesData.filter(src => src.type === 'confiable');
        const unreliableSources = selectedSourcesData.filter(src => src.type === 'no-confiable');
        const sourcesCorrect = reliableSources.length > unreliableSources.length || selectedSourcesData.length === 0;

        // Verificar cálculo de interés simple
        const correctReturn = calculateSimpleInterest(
            currentCompany.investmentAmount,
            currentCompany.interestRate,
            currentCompany.investmentPeriod
        );
        const calculationCorrect = gameState.calculatedReturn !== null && 
            Math.abs(gameState.calculatedReturn - correctReturn) < 0.01;

        // Verificar justificaciones por fuente
        const availableSources = getAvailableSources(currentCompany);
        const justificationDetails = availableSources.map(sourceType => {
            const justification = gameState.sourceJustifications.find(j => j.sourceType === sourceType);
            const correctAnswer = getCorrectAnswer(sourceType, currentCompany);
            return {
                sourceType,
                userAnswer: justification?.selectedAnswer || 'No respondido',
                correctAnswer,
                isCorrect: justification?.isCorrect === true
            };
        });
        const correctJustifications = justificationDetails.filter(j => j.isCorrect).length;
        const totalJustifications = justificationDetails.length;
        const justificationsCorrect = correctJustifications === totalJustifications;

        // Verificar nivel de riesgo seleccionado
        const correctRiskLevel = currentCompany.riskLevel === gameState.selectedRiskLevel || 
                                (currentCompany.riskLevel === 'Alto' && gameState.selectedRiskLevel === 'Estafa');
        const riskLevelCorrect = correctRiskLevel;

        // Calcular puntaje y feedback
        let scorePoints = 0;
        let feedbackParts: string[] = [];
        let detailedFeedback: string[] = [];

        // Decisión
        if (decisionCorrect) {
            scorePoints += 50;
            feedbackParts.push('✅ Decisión correcta');
        } else {
            feedbackParts.push('❌ Decisión incorrecta');
            detailedFeedback.push(`\n📊 DECISIÓN:`);
            detailedFeedback.push(`   Tu respuesta: ${invest ? 'Invertir' : 'Rechazar'}`);
            detailedFeedback.push(`   Respuesta correcta: ${isFeasible ? 'Invertir' : 'Rechazar'}`);
        }

        // Fuentes
        if (sourcesCorrect && gameState.selectedSources.length > 0) {
            scorePoints += 20;
            feedbackParts.push('✅ Fuentes confiables seleccionadas');
        } else if (gameState.selectedSources.length > 0) {
            feedbackParts.push('⚠️ Seleccionaste fuentes no confiables');
            detailedFeedback.push(`\n📚 FUENTES:`);
            detailedFeedback.push(`   Fuentes confiables seleccionadas: ${reliableSources.length}`);
            detailedFeedback.push(`   Fuentes no confiables seleccionadas: ${unreliableSources.length}`);
        }

        // Cálculo
        if (calculationCorrect) {
            scorePoints += 20;
            feedbackParts.push('✅ Cálculo de interés simple correcto');
        } else if (gameState.calculatedReturn !== null) {
            feedbackParts.push('⚠️ Cálculo de interés simple incorrecto');
            detailedFeedback.push(`\n🧮 CÁLCULO:`);
            detailedFeedback.push(`   Tu cálculo: $${gameState.calculatedReturn.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            detailedFeedback.push(`   Respuesta correcta: $${correctReturn.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            detailedFeedback.push(`   Fórmula: P + (P × r × t) = $${currentCompany.investmentAmount.toLocaleString()} + ($${currentCompany.investmentAmount.toLocaleString()} × ${currentCompany.interestRate}% × ${currentCompany.investmentPeriod})`);
        } else {
            detailedFeedback.push(`\n🧮 CÁLCULO:`);
            detailedFeedback.push(`   No realizaste el cálculo`);
            detailedFeedback.push(`   Respuesta correcta: $${correctReturn.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }

        // Justificaciones
        if (justificationsCorrect) {
            scorePoints += 30;
            feedbackParts.push(`✅ Justificaciones correctas (${correctJustifications}/${totalJustifications})`);
        } else {
            feedbackParts.push(`⚠️ Algunas justificaciones incorrectas (${correctJustifications}/${totalJustifications})`);
            detailedFeedback.push(`\n📋 JUSTIFICACIONES:`);
            justificationDetails.forEach(detail => {
                const sourceNames: Record<SourceJustification['sourceType'], string> = {
                    'superintendencia': 'Superintendencia',
                    'sri': 'SRI',
                    'judicial': 'Función Judicial',
                    'google': 'Google Reviews',
                    'redes': 'Redes Sociales',
                    'banco': 'Banco Central'
                };
                if (!detail.isCorrect) {
                    detailedFeedback.push(`   ${sourceNames[detail.sourceType]}:`);
                    detailedFeedback.push(`      Tu respuesta: ${detail.userAnswer}`);
                    detailedFeedback.push(`      Respuesta correcta: ${detail.correctAnswer}`);
                }
            });
        }

        // Nivel de riesgo
        if (riskLevelCorrect) {
            scorePoints += 20;
            feedbackParts.push('✅ Nivel de riesgo correcto');
        } else {
            feedbackParts.push('❌ Nivel de riesgo incorrecto');
            detailedFeedback.push(`\n⚠️ NIVEL DE RIESGO:`);
            detailedFeedback.push(`   Tu respuesta: ${gameState.selectedRiskLevel || 'No seleccionado'}`);
            detailedFeedback.push(`   Respuesta correcta: ${currentCompany.riskLevel}`);
        }

        const isCorrect = decisionCorrect && sourcesCorrect && calculationCorrect && justificationsCorrect && riskLevelCorrect;
        
        // Calcular ganancia/pérdida monetaria
        let capitalChange = 0;
        if (invest && decisionCorrect) {
            // Si invirtió correctamente, gana el retorno calculado
            const correctReturn = calculateSimpleInterest(
                currentCompany.investmentAmount,
                currentCompany.interestRate,
                currentCompany.investmentPeriod
            );
            capitalChange = correctReturn - currentCompany.investmentAmount; // Ganancia neta
        } else if (invest && !decisionCorrect) {
            // Si invirtió incorrectamente, pierde el monto invertido
            capitalChange = -currentCompany.investmentAmount;
        } else if (!invest && decisionCorrect) {
            // Si rechazó correctamente, no gana ni pierde (pero podría tener un pequeño bono por evitar pérdidas)
            capitalChange = 0;
        } else if (!invest && !decisionCorrect) {
            // Si rechazó incorrectamente una buena inversión, pierde la oportunidad (pequeña penalización)
            const missedReturn = calculateSimpleInterest(
                currentCompany.investmentAmount,
                currentCompany.interestRate,
                currentCompany.investmentPeriod
            );
            capitalChange = -(missedReturn - currentCompany.investmentAmount) * 0.3; // Penalización del 30% de la ganancia perdida
        }
        
        let message = feedbackParts.join('\n');
        
        if (!isCorrect && detailedFeedback.length > 0) {
            message += '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
            message += '\n📝 DETALLE DE RESPUESTAS:';
            message += detailedFeedback.join('\n');
        }
        
        message += isCorrect 
            ? '\n\n¡Excelente trabajo detective! Has evaluado correctamente la inversión usando fuentes confiables, cálculos precisos y justificaciones verificables.'
            : '\n\nRecuerda: siempre verifica tus fuentes, calcula los retornos y justifica con hechos verificables.';

        setGameState(prev => ({
            ...prev,
            score: prev.score + scorePoints,
            lives: decisionCorrect ? prev.lives : prev.lives - 1,
            capital: prev.capital + capitalChange,
            casosResueltos: prev.casosResueltos + 1,
            feedback: {
                show: true,
                isCorrect,
                message
            }
        }));
    };

    const nextTurn = () => {
        setGameState(prev => {
            const casesToUse = gameCasesList && gameCasesList.length > 0 ? gameCasesList : companies;
            const nextIndex = prev.currentCompanyIndex + 1;
            const isGameOver = nextIndex >= casesToUse.length || prev.lives <= 0;

            const nextCompany = casesToUse[nextIndex];
            return {
                ...prev,
                currentCompanyIndex: nextIndex,
                isGameOver,
                feedback: null,
                selectedSources: [],
                calculatedReturn: null,
                selectedReasons: [],
                sourceJustifications: nextCompany ? initializeJustifications(nextCompany) : [],
                selectedRiskLevel: null,
                activeTab: null,
                // Mantener casosResueltos y capital
            };
        });
    };

    const restartGame = () => {
        const casesToUse = gameCasesList && gameCasesList.length > 0 ? gameCasesList : companies;
        const firstCompany = casesToUse[0];
        setGameState({
            score: 0,
            lives: 3,
            currentCompanyIndex: 0,
            isGameOver: false,
            feedback: null,
            selectedSources: [],
            calculatedReturn: null,
            selectedReasons: [],
            sourceJustifications: firstCompany ? initializeJustifications(firstCompany) : [],
            selectedRiskLevel: null,
            activeTab: null,
            casosResueltos: 0,
            capital: INITIAL_CAPITAL,
        });
    };

    return {
        gameState,
        currentCompany,
        checkInvestment,
        nextTurn,
        restartGame,
        toggleSource,
        setCalculatedReturn,
        toggleReason,
        setActiveTab,
        setSourceJustification,
        setRiskLevel,
        isJustificationComplete,
    };
};
