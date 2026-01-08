import React from 'react';
import { Company } from '../types';
import './CompanySidebar.css';

interface CompanySidebarProps {
  company: Company;
  currentIndex: number;
  totalCompanies: number;
  disabled: boolean;
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
  disabled,
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
      {/* Banner y Caso */}
      <div className="sidebar-banner">
        <div className="case-badge">
          Caso {currentIndex + 1} / {totalCompanies}
        </div>
        <div className="verified-seal">
          <span className="seal-icon">💠</span>
          <span className="seal-text">Business Verified</span>
        </div>
      </div>

      {/* Tarjeta del CEO Superpuesta */}
      <div className="ceo-profile-card">
        <div className="avatar-wrapper">
          <div className="avatar-circle">{data.avatar}</div>
        </div>
        <div className="ceo-details">
          <div className="ceo-header-row">
            <span className="role-chip">CEO & FOUNDER</span>
          </div>
          <h3 className="ceo-name">{data.ceoName}</h3>
          <div className="ceo-ruc-badge">RUC: {data.ceoRuc}</div>
        </div>
      </div>

      <div className="sidebar-scrollable-content">
        {/* Información de la Empresa */}
        <div className="info-card-sidebar">
          <h2 className="company-main-name">{company.name}</h2>
          <div className="sector-pill">{company.sector}</div>
          <p className="company-desc-text">{company.description}</p>
        </div>

        {/* Dash de Inversión */}
        <div className="investment-dash">
          <h4 className="dash-title">📊 Perfil de Inversión</h4>
          <div className="dash-grid">
            <div className="dash-item">
              <span className="dash-label">Retorno</span>
              <span className="dash-value highlight">{company.interestRate}%</span>
              <span className="dash-sub">Anual</span>
            </div>
            <div className="dash-item">
              <span className="dash-label">Capital</span>
              <span className="dash-value">${company.investmentAmount.toLocaleString()}</span>
              <span className="dash-sub">Mínimo</span>
            </div>
            <div className="dash-item">
              <span className="dash-label">Plazo</span>
              <span className="dash-value">{company.investmentPeriod}</span>
              <span className="dash-sub">Años</span>
            </div>
          </div>
        </div>

        {/* Presencia Digital */}
        <div className="digital-presence-card">
          <h4 className="dash-title">🌐 Canales Digitales</h4>
          <div className="social-pill-container">
            <div className="social-pill">
              <span className="pill-icon">🐦</span>
              <span className="pill-handle">{data.twitter}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySidebar;
