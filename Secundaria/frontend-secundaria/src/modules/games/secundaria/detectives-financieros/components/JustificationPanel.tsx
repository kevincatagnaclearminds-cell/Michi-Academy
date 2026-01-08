import React, { useState } from 'react';
import { Company, SourceJustification } from '../types';
import './JustificationPanel.css';

interface JustificationPanelProps {
    company: Company;
    sourceJustifications: SourceJustification[];
    selectedRiskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa' | null;
    onSourceJustificationChange: (sourceType: SourceJustification['sourceType'], answer: string) => void;
    onRiskLevelChange: (riskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa') => void;
    onInvest: () => void;
    onReject: () => void;
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
    onRiskLevelChange,
    onInvest,
    onReject
}) => {
    const availableSources = [
        'superintendencia',
        'sri',
        'judicial',
        'google',
        'redes'
    ] as SourceJustification['sourceType'][];

    const getSourceName = (sourceType: SourceJustification['sourceType']): string => {
        switch (sourceType) {
            case 'superintendencia': return 'Superintendencia';
            case 'sri': return 'SRI';
            case 'judicial': return 'Función Judicial';
            case 'google': return 'Google Reviews';
            case 'redes': return 'Redes Sociales';
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
            default: return '📊';
        }
    };

    return (
        <div className="justification-panel">
            <div className="justification-container">
                <div className="justification-main-content">
                    <div className="justification-header-section">
                        <h3 className="justification-title">🔍 Evidencias Recolectadas</h3>
                        <p className="justification-subtitle">
                            Resumen de tus conclusiones basadas en las fuentes investigadas.
                        </p>
                    </div>
                    
                    <div className="investigation-summary-grid">
                        {availableSources.map(sourceType => {
                            const justification = sourceJustifications.find(j => j.sourceType === sourceType);
                            const isAnswered = justification?.selectedAnswer !== null && justification?.selectedAnswer !== undefined;
                            const isCorrect = justification?.isCorrect === true;
                            
                            return (
                                <div key={sourceType} className={`summary-card ${isAnswered ? 'is-answered' : 'is-pending'}`}>
                                    <div className="card-top">
                                        <div className="source-label">
                                            <span className="source-icon">{getSourceIcon(sourceType)}</span>
                                            <span className="source-name">{getSourceName(sourceType)}</span>
                                        </div>
                                        {isAnswered && (
                                            <div className="status-indicator">
                                                ✅
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        {isAnswered ? (
                                            <>
                                                <p className="actual-conclusion">"{justification.selectedAnswer}"</p>
                                                <span className="verdict-badge justified">
                                                    Investigación Completada
                                                </span>
                                            </>
                                        ) : (
                                            <div className="empty-state">
                                                <span className="empty-icon">⏳</span>
                                                <p>Sin investigar</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="justification-sidebar">
                    <div className="decision-card">
                        <div className="decision-header">
                            <h4>👨‍⚖️ Veredicto Final</h4>
                            <p>Define tu estrategia basándote en el riesgo detectado.</p>
                        </div>

                        <div className="risk-selection-area">
                            <label>Nivel de Riesgo Estimado:</label>
                            <div className="risk-buttons-grid">
                                {(['Bajo', 'Medio', 'Alto', 'Estafa'] as const).map(risk => (
                                    <button
                                        key={risk}
                                        className={`risk-btn ${risk.toLowerCase()} ${selectedRiskLevel === risk ? 'active' : ''}`}
                                        onClick={() => onRiskLevelChange(risk)}
                                    >
                                        <span className="risk-dot"></span>
                                        {risk}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="decision-actions">
                            <button 
                                className="action-btn invest" 
                                onClick={onInvest}
                                disabled={!selectedRiskLevel}
                            >
                                <span className="icon">💰</span>
                                <div className="text-group">
                                    <span className="main-text">Realizar Inversión</span>
                                    <span className="sub-text">Confío en este negocio</span>
                                </div>
                            </button>
                            
                            <button 
                                className="action-btn reject" 
                                onClick={onReject}
                                disabled={!selectedRiskLevel}
                            >
                                <span className="icon">🚫</span>
                                <div className="text-group">
                                    <span className="main-text">Rechazar Negocio</span>
                                    <span className="sub-text">Demasiado arriesgado</span>
                                </div>
                            </button>
                        </div>

                        {!selectedRiskLevel && (
                            <p className="selection-reminder">
                                💡 Debes investigar todas las fuentes y seleccionar un nivel de riesgo antes de decidir.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JustificationPanel;
