import React, { useState } from 'react';
import { Company } from '../types';
import './CaseSelection.css';

interface CaseSelectionProps {
    cases: Company[];
    onSelectCase: (caseIndex: number) => void;
}

const CaseSelection: React.FC<CaseSelectionProps> = ({ cases, onSelectCase }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const CASES_PER_PAGE = 3;
    const totalPages = Math.ceil(cases.length / CASES_PER_PAGE);

    const getCaseIcon = (index: number) => {
        const icons = ['📁', '🔍', '📋'];
        return icons[index % icons.length] || '📁';
    };

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage((prev) => {
            const newPage = prev === 0 ? totalPages - 1 : prev - 1;
            return newPage;
        });
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentPage((prev) => {
            const newPage = prev === totalPages - 1 ? 0 : prev + 1;
            return newPage;
        });
    };

    const handleSelectCase = (index: number) => {
        // Encontrar el índice real en el array original de companies
        const selectedCase = cases[index];
        // El índice que se pasa debe ser el índice en el array original
        onSelectCase(index);
    };

    // Obtener los casos de la página actual
    const getCurrentPageCases = () => {
        const startIndex = currentPage * CASES_PER_PAGE;
        const endIndex = startIndex + CASES_PER_PAGE;
        return cases.slice(startIndex, endIndex).map((caseItem, localIndex) => ({
            caseItem,
            globalIndex: startIndex + localIndex
        }));
    };

    const currentPageCases = getCurrentPageCases();

    return (
        <div className="case-selection-container">
            <div className="case-selection-header">
                <div className="detective-badge">
                    <span className="badge-icon">🕵️‍♂️</span>
                    <span className="badge-text">OFICINA DE DETECTIVES FINANCIEROS</span>
                </div>
                <h1 className="case-selection-title">Nuevos Casos Pendientes</h1>
                <p className="case-selection-subtitle">
                    Navega entre los casos y selecciona uno para investigar. Cada caso requiere tu análisis experto 
                    para determinar si es una inversión segura o un riesgo.
                </p>
            </div>

            <div className="carousel-container">
                <button 
                    className="carousel-nav-btn carousel-nav-left"
                    onClick={handlePrevious}
                    aria-label="Página anterior"
                >
                    <span className="nav-icon">←</span>
                </button>

                <div className="carousel-wrapper">
                    <div className="cases-grid">
                        {currentPageCases.map(({ caseItem, globalIndex }) => {
                            return (
                                <div 
                                    key={caseItem.id} 
                                    className="case-card"
                                >
                                    <div className="case-card-header">
                                        <div className="case-icon">{getCaseIcon(globalIndex)}</div>
                                        <div className="case-number">Caso #{globalIndex + 1}</div>
                                    </div>
                                    
                                    <div className="case-card-body">
                                        <h3 className="case-company-name">{caseItem.name}</h3>
                                        <p className="case-description">{caseItem.description}</p>
                                        
                                        <div className="case-details">
                                            <div className="case-detail-item">
                                                <span className="detail-label">Sector:</span>
                                                <span className="detail-value">{caseItem.sector}</span>
                                            </div>
                                            <div className="case-detail-item">
                                                <span className="detail-label">Tasa de Interés:</span>
                                                <span className="detail-value">{caseItem.interestRate}%</span>
                                            </div>
                                            <div className="case-detail-item">
                                                <span className="detail-label">Monto:</span>
                                                <span className="detail-value">
                                                    ${caseItem.investmentAmount.toLocaleString('es-EC')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="case-card-footer">
                                        <button 
                                            className="case-select-btn"
                                            onClick={() => handleSelectCase(globalIndex)}
                                        >
                                            Investigar Caso →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Rellenar espacios vacíos si hay menos de 3 casos en la última página */}
                        {currentPageCases.length < CASES_PER_PAGE && 
                            Array.from({ length: CASES_PER_PAGE - currentPageCases.length }).map((_, index) => (
                                <div key={`empty-${index}`} className="case-card-empty" />
                            ))
                        }
                    </div>
                </div>

                <button 
                    className="carousel-nav-btn carousel-nav-right"
                    onClick={handleNext}
                    aria-label="Siguiente página"
                >
                    <span className="nav-icon">→</span>
                </button>
            </div>

            <div className="carousel-indicators">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <button
                        key={pageIndex}
                        className={`indicator-dot ${pageIndex === currentPage ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageIndex)}
                        aria-label={`Ir a la página ${pageIndex + 1}`}
                    />
                ))}
            </div>

            <div className="case-selection-footer">
                <div className="detective-tip">
                    <span className="tip-icon">💡</span>
                    <span className="tip-text">
                        Tip: Revisa cuidadosamente todas las fuentes de información antes de tomar tu decisión final.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CaseSelection;

