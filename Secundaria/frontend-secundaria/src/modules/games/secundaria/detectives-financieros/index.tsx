import React, { useState, useMemo } from "react";
import CompanySidebar from "./components/CompanySidebar";
import GameControls from "./components/GameControls";
import Feedback from "./components/Feedback";
import InformationSources from "./components/InformationSources";
import InterestCalculator from "./components/InterestCalculator";
import JustificationPanel from "./components/JustificationPanel";
import TabNavigator from "./components/TabNavigator";
import CaseSelection from "./components/CaseSelection";
import GameHeader from "./components/GameHeader";
import { useFinancialDetective } from "./hooks/useFinancialDetective";
import { companies } from "./data";
import "./detectives.css";

const DetectivesFinancierosPage = () => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number | null>(null);
  const [availableCases, setAvailableCases] = useState<typeof companies>([]);
  const [gameCases, setGameCases] = useState<typeof companies>([]); // Los 3 casos del juego

  // Seleccionar 3 casos específicos: 2 para rechazar (alto riesgo) y 1 para invertir (bajo/medio riesgo)
  useMemo(() => {
    // Casos de alto riesgo (para rechazar)
    const highRiskCases = companies.filter(c => c.riskLevel === 'Alto');
    // Casos factibles (para invertir) - tasa > 5% y riesgo no alto, o bono gubernamental
    const feasibleCases = companies.filter(c => 
      (c.interestRate > 5 && c.riskLevel !== 'Alto') || 
      (c.sector === 'Gobierno' && c.riskLevel === 'Bajo')
    );
    
    // Seleccionar 2 casos de alto riesgo y 1 factible
    const shuffledHighRisk = [...highRiskCases].sort(() => Math.random() - 0.5);
    const shuffledFeasible = [...feasibleCases].sort(() => Math.random() - 0.5);
    
    const selectedCases = [
      shuffledHighRisk[0] || highRiskCases[0],
      shuffledHighRisk[1] || highRiskCases[0],
      shuffledFeasible[0] || feasibleCases[0]
    ].filter(Boolean);
    
    setAvailableCases(selectedCases);
  }, []);

  const {
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
  } = useFinancialDetective(selectedCaseIndex !== null ? selectedCaseIndex : undefined, gameCases);

  const [showJustificationAlert, setShowJustificationAlert] = useState(false);

  const handleCaseSelection = (caseIndex: number) => {
    // El caso seleccionado será el primero en el juego
    const selectedCase = availableCases[caseIndex];
    
    // Crear array de 3 casos: el seleccionado + los otros 2
    const otherCases = availableCases.filter((_, idx) => idx !== caseIndex);
    const newGameCases = [selectedCase, ...otherCases].filter(Boolean);
    
    setGameCases(newGameCases);
    setSelectedCaseIndex(0); // Siempre empezar desde el índice 0 en el juego
  };

  const handleInvest = () => {
    if (!isJustificationComplete()) {
      setShowJustificationAlert(true);
      setActiveTab('justification');
      return;
    }
    checkInvestment(true);
  };

  const handleReject = () => {
    if (!isJustificationComplete()) {
      setShowJustificationAlert(true);
      setActiveTab('justification');
      return;
    }
    checkInvestment(false);
  };

  // Mostrar selección de casos si no se ha seleccionado uno
  if (selectedCaseIndex === null) {
    return (
      <CaseSelection 
        cases={availableCases}
        onSelectCase={handleCaseSelection}
      />
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="detective-container">
        <div className="game-header">
          <h1>🕵️‍♂️ Reporte Final</h1>
        </div>
        <div className="detective-card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Juego Terminado</h2>
          <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
            Puntaje Final: <strong>{gameState.score}</strong>
          </p>
          <p>
            {gameState.score >= 400
              ? "¡Excelente trabajo! Eres un experto financiero que sabe evaluar inversiones usando fuentes confiables, cálculos precisos y justificaciones verificables."
              : "Sigue practicando para mejorar tu capacidad de evaluar inversiones. Recuerda: siempre verifica tus fuentes, calcula los retornos y justifica con hechos verificables."}
          </p>
          <button
            className="btn-control btn-invest"
            style={{ margin: '20px auto', maxWidth: '200px' }}
            onClick={() => {
              setSelectedCaseIndex(null);
              setGameCases([]);
              restartGame();
            }}
          >
            Seleccionar Nuevo Caso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detective-container">
      {currentCompany ? (
        <>
          <GameHeader 
            lives={gameState.lives}
            casosResueltos={gameState.casosResueltos}
            capital={gameState.capital}
          />
          <div className="game-layout">
          <div className="game-left-panel">
            <CompanySidebar 
              company={currentCompany}
              currentIndex={gameState.currentCompanyIndex}
              totalCompanies={gameCases.length > 0 ? gameCases.length : 3}
              onInvest={handleInvest}
              onReject={handleReject}
              disabled={gameState.feedback !== null}
              selectedRiskLevel={gameState.selectedRiskLevel}
              onRiskLevelChange={setRiskLevel}
            />
          </div>

          <div className="game-right-panel">
            <TabNavigator 
              activeTab={gameState.activeTab}
              onTabChange={setActiveTab}
            />
            
            <div className="tab-content">
              {gameState.activeTab === 'sources' && (
                <InformationSources
                  sources={currentCompany.informationSources}
                  selectedSources={gameState.selectedSources}
                  onToggleSource={toggleSource}
                  company={currentCompany}
                />
              )}

              {gameState.activeTab === 'calculator' && (
                <InterestCalculator
                  principal={currentCompany.investmentAmount}
                  interestRate={currentCompany.interestRate}
                  period={currentCompany.investmentPeriod}
                  onCalculate={setCalculatedReturn}
                  calculatedReturn={gameState.calculatedReturn}
                />
              )}

              {gameState.activeTab === 'justification' && (
                <JustificationPanel
                  company={currentCompany}
                  sourceJustifications={gameState.sourceJustifications}
                  selectedRiskLevel={gameState.selectedRiskLevel}
                  onSourceJustificationChange={setSourceJustification}
                  onRiskLevelChange={setRiskLevel}
                />
              )}

              {gameState.activeTab === null && (
                <div className="empty-panel">
                  <div className="empty-panel-icon">🔍</div>
                  <h3>Selecciona una herramienta</h3>
                  <p>Usa las pestañas arriba para investigar, calcular o justificar tu decisión</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </>
      ) : (
        <div>Cargando caso...</div>
      )}

      {showJustificationAlert && (
        <div className="modal-overlay" onClick={() => setShowJustificationAlert(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Justificación Requerida</h3>
              <button className="modal-close" onClick={() => setShowJustificationAlert(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Primero debe justificar su respuesta completando todas las fuentes y seleccionando el nivel de riesgo.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal" onClick={() => {
                setShowJustificationAlert(false);
                setActiveTab('justification');
              }}>
                Ir a Justificar
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.feedback && (
        <Feedback
          show={gameState.feedback.show}
          isCorrect={gameState.feedback.isCorrect}
          message={gameState.feedback.message}
          onNext={nextTurn}
        />
      )}
    </div>
  );
};

export default DetectivesFinancierosPage;


