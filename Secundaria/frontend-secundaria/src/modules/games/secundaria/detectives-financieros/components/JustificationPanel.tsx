import React, { useState } from 'react';
import { Company, SourceJustification } from '../types';
import './JustificationPanel.css';

interface JustificationPanelProps {
    company: Company;
    sourceJustifications: SourceJustification[];
    selectedRiskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa' | null;
    onSourceJustificationChange: (sourceType: SourceJustification['sourceType'], answer: string) => void;
    onRiskLevelChange: (riskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa') => void;
}

// Opciones de respuesta para cada fuente
const getSourceOptions = (sourceType: SourceJustification['sourceType'], company: Company) => {
    switch (sourceType) {
        case 'superintendencia':
            return [
                'Empresa con pérdidas y alto endeudamiento',
                'Empresa con ganancias estables',
                'Empresa con crecimiento constante',
                'No se encontró información'
            ];
        case 'sri':
            return [
                'Empresa al día con sus obligaciones fiscales',
                'Empresa con deudas fiscales pendientes',
                'Empresa con declaraciones pendientes',
                'No se encontró información'
            ];
        case 'judicial':
            return [
                'Sin casos legales pendientes',
                'Casos legales pendientes',
                'Empresa en proceso judicial',
                'No se encontró información'
            ];
        case 'google':
            return [
                'Reseñas mayormente positivas',
                'Reseñas mayormente negativas',
                'Reseñas mixtas',
                'No se encontraron reseñas'
            ];
        case 'redes':
            return [
                'Información confiable y verificada',
                'Información no confiable con muchos bots',
                'Información mixta con dudas',
                'No se encontró información'
            ];
        case 'banco':
            return [
                'Empresa registrada y con licencia vigente',
                'Empresa no registrada o sin licencia',
                'Empresa con inspecciones pendientes',
                'No se encontró información'
            ];
        default:
            return [];
    }
};

// Respuestas correctas según el nivel de riesgo de la empresa
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

const JustificationPanel: React.FC<JustificationPanelProps> = ({
    company,
    sourceJustifications,
    selectedRiskLevel,
    onSourceJustificationChange,
    onRiskLevelChange
}) => {
    // Fuentes disponibles según el sector
    const getAvailableSources = (): SourceJustification['sourceType'][] => {
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
    
    const availableSources = getAvailableSources();

    const getSourceName = (sourceType: SourceJustification['sourceType']): string => {
        switch (sourceType) {
            case 'superintendencia': return 'Superintendencia';
            case 'sri': return 'SRI';
            case 'judicial': return 'Función Judicial';
            case 'google': return 'Google Reviews';
            case 'redes': return 'Redes Sociales';
            case 'banco': return 'Banco Central';
            default: return '';
        }
    };

    const getSourceIcon = (sourceType: SourceJustification['sourceType']): string => {
        switch (sourceType) {
            case 'superintendencia': return '🏛️';
            case 'sri': return '📋';
            case 'judicial': return '⚖️';
            case 'google': return '⭐';
            case 'redes': return '🐦';
            case 'banco': return '🏦';
            default: return '📊';
        }
    };

    const handleAnswerSelect = (sourceType: SourceJustification['sourceType'], answer: string) => {
        onSourceJustificationChange(sourceType, answer);
    };

    const getJustificationForSource = (sourceType: SourceJustification['sourceType']): SourceJustification | undefined => {
        return sourceJustifications.find(j => j.sourceType === sourceType);
    };

    return (
        <div className="justification-panel">
            <h3 className="justification-title">📋 Justifica tu Decisión</h3>
            <p className="justification-subtitle">
                Según tu investigación, selecciona la respuesta para cada fuente:
            </p>
            
            <div className="justification-matrix">
                <table className="justification-table">
                    <thead>
                        <tr>
                            <th className="source-column">Fuente</th>
                            <th className="answer-column">Respuesta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableSources.map(sourceType => {
                            const justification = getJustificationForSource(sourceType);
                            const options = getSourceOptions(sourceType, company);
                            const correctAnswer = getCorrectAnswer(sourceType, company);
                            const isAnswered = justification?.selectedAnswer !== null && justification?.selectedAnswer !== undefined;
                            const isCorrect = justification?.isCorrect === true;
                            
                            return (
                                <tr key={sourceType} className={`matrix-row ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                                    <td className="source-cell">
                                        <div className="source-info">
                                            <span className="source-icon">{getSourceIcon(sourceType)}</span>
                                            <span className="source-name">{getSourceName(sourceType)}</span>
                                        </div>
                                    </td>
                                    <td className="answer-cell">
                                        <select
                                            className={`answer-select ${isAnswered ? (isCorrect ? 'answer-correct' : 'answer-incorrect') : ''}`}
                                            value={justification?.selectedAnswer || ''}
                                            onChange={(e) => handleAnswerSelect(sourceType, e.target.value)}
                                            disabled={isAnswered}
                                        >
                                            <option value="">Selecciona una respuesta...</option>
                                            {options.map((option, idx) => (
                                                <option key={idx} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        {isAnswered && (
                                            <div className={`answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
                                                {isCorrect ? '✅ Correcto' : '❌ Incorrecto'}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JustificationPanel;
