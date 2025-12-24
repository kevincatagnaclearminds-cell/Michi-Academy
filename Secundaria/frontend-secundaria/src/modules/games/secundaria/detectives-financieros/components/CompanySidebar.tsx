import React from 'react';
import { Company } from '../types';
import './CompanySidebar.css';

interface CompanySidebarProps {
  company: Company;
  currentIndex: number;
  totalCompanies: number;
  onInvest: () => void;
  onReject: () => void;
  disabled: boolean;
  selectedRiskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa' | null;
  onRiskLevelChange: (riskLevel: 'Bajo' | 'Medio' | 'Alto' | 'Estafa') => void;
}

// Función para generar datos simulados según la empresa
const generateCompanyData = (company: Company) => {
  const ceoNames = [
    'Carlos Mendoza', 'María González', 'Roberto Silva', 
    'Ana Martínez', 'Luis Ramírez', 'Patricia López', 
    'Fernando Torres', 'Laura Sánchez'
  ];
  
  const avatars = ['👔', '👩‍💼', '👨‍💼', '👩‍💻', '👨‍💻', '👩‍🔬', '👨‍🔬', '👩‍⚕️'];
  
  // Generar RUCs únicos para cada empresa
  const rucs = [
    '0991234567001', '0992345678001', '0993456789001',
    '0994567890001', '0995678901001', '0996789012001',
    '0997890123001', '0998901234001'
  ];
  
  const index = parseInt(company.id) - 1;
  const ceoName = ceoNames[index % ceoNames.length];
  const avatar = avatars[index % avatars.length];
  const ceoRuc = rucs[index % rucs.length];
  
  // Generar reviews según el nivel de riesgo
  const reviews = company.riskLevel === 'Alto' ? [
    { author: 'Juan Pérez', rating: 1, text: 'No cumplieron con lo prometido. Perdí mi dinero.', date: 'Hace 2 meses', positive: false },
    { author: 'María López', rating: 2, text: 'Muy mala experiencia. No recomiendo.', date: 'Hace 1 mes', positive: false },
    { author: 'Carlos Ruiz', rating: 1, text: 'Estafa total. No inviertan aquí.', date: 'Hace 3 semanas', positive: false },
    { author: 'Ana García', rating: 2, text: 'Tuve problemas para retirar mis fondos.', date: 'Hace 2 semanas', positive: false }
  ] : company.riskLevel === 'Medio' ? [
    { author: 'Roberto Silva', rating: 4, text: 'Buena empresa, cumplieron con lo acordado.', date: 'Hace 1 mes', positive: true },
    { author: 'Laura Martínez', rating: 3, text: 'Regular, algunos retrasos pero al final cumplieron.', date: 'Hace 2 meses', positive: true },
    { author: 'Pedro González', rating: 2, text: 'No fue lo que esperaba.', date: 'Hace 3 meses', positive: false }
  ] : [
    { author: 'Sofía Ramírez', rating: 5, text: 'Excelente servicio, muy confiable y profesional.', date: 'Hace 1 mes', positive: true },
    { author: 'Miguel Torres', rating: 5, text: 'La mejor inversión que he hecho. Totalmente recomendado.', date: 'Hace 2 meses', positive: true },
    { author: 'Carmen Díaz', rating: 4, text: 'Muy buena experiencia, cumplieron todo a tiempo.', date: 'Hace 3 meses', positive: true },
    { author: 'Diego Morales', rating: 5, text: 'Empresa seria y confiable. Excelente atención.', date: 'Hace 1 mes', positive: true }
  ];
  
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const positiveCount = reviews.filter(r => r.positive).length;
  const negativeCount = reviews.filter(r => !r.positive).length;
  
  return {
    ceoName,
    avatar,
    ceoRuc,
    reviews,
    averageRating: averageRating.toFixed(1),
    positiveCount,
    negativeCount,
    twitter: `@${company.name.toLowerCase().replace(/\s+/g, '')}`
  };
};

const CompanySidebar: React.FC<CompanySidebarProps> = ({ 
  company, 
  currentIndex, 
  totalCompanies,
  onInvest,
  onReject,
  disabled,
  selectedRiskLevel,
  onRiskLevelChange
}) => {
  const data = generateCompanyData(company);
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Bajo': return '#2ecc71';
      case 'Medio': return '#f1c40f';
      case 'Alto': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="company-sidebar">
      {/* Caso X/8 */}
      <div className="case-number-header">
        Caso {currentIndex + 1} / {totalCompanies}
      </div>

      {/* Avatar y CEO */}
      <div className="sidebar-header">
        <div className="company-avatar">{data.avatar}</div>
        <div className="ceo-info">
          <div className="ceo-label">CEO / Director</div>
          <div className="ceo-name">{data.ceoName}</div>
          <div className="ceo-ruc">RUC: {data.ceoRuc}</div>
        </div>
      </div>

      {/* Información de la empresa */}
      <div className="sidebar-company-info">
        <h2 className="company-name-sidebar">{company.name}</h2>
        <div className="company-sector-sidebar">{company.sector}</div>
        <div className="company-description-sidebar">{company.description}</div>
      </div>

      {/* Estadísticas financieras */}
      <div className="sidebar-stats">
        <div className="stat-item-sidebar">
          <div className="stat-label-sidebar">Tasa de Interés</div>
          <div className="stat-value-sidebar interest">{company.interestRate}%</div>
        </div>
        <div className="stat-item-sidebar">
          <div className="stat-label-sidebar">Monto de Inversión</div>
          <div className="stat-value-sidebar investment">${company.investmentAmount.toLocaleString()}</div>
        </div>
        <div className="stat-item-sidebar">
          <div className="stat-label-sidebar">Período</div>
          <div className="stat-value-sidebar period">{company.investmentPeriod} año{company.investmentPeriod !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="sidebar-social">
        <div className="social-title">📱 Redes Sociales</div>
        <div className="social-links">
          <div className="social-link">
            <span className="social-icon">🐦</span>
            <span className="social-text">{data.twitter}</span>
          </div>
        </div>
      </div>

      {/* Frame de Decisión Final */}
      <div className="decision-frame">
        <div className="decision-frame-header">
          <span className="decision-icon">⚖️</span>
          <span className="decision-title">Decisión Final</span>
        </div>
        
        {/* Selección de Riesgo */}
        <div className="sidebar-risk-selection">
          <div className="risk-selection-title">Elige el tipo de riesgo:</div>
          <div className="risk-options-sidebar">
            {(['Bajo', 'Medio', 'Alto', 'Estafa'] as const).map(risk => (
              <button
                key={risk}
                className={`risk-button-sidebar ${selectedRiskLevel === risk ? 'selected' : ''}`}
                onClick={() => onRiskLevelChange(risk)}
                disabled={disabled}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="sidebar-actions">
          <button
            className="btn-sidebar btn-reject"
            onClick={onReject}
            disabled={disabled}
          >
            ❌ Rechazar
          </button>
          <button
            className="btn-sidebar btn-invest"
            onClick={onInvest}
            disabled={disabled}
          >
            💼 Invertir
          </button>
        </div>
      </div>

    </div>
  );
};

export default CompanySidebar;

