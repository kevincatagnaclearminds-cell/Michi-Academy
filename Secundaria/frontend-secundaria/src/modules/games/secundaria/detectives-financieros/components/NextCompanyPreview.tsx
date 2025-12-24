import React from 'react';
import { Company } from '../types';
import './NextCompanyPreview.css';

interface NextCompanyPreviewProps {
  nextCompany: Company | null;
  currentIndex: number;
  totalCompanies: number;
}

const NextCompanyPreview: React.FC<NextCompanyPreviewProps> = ({ 
  nextCompany, 
  currentIndex, 
  totalCompanies 
}) => {
  if (!nextCompany || currentIndex >= totalCompanies - 1) {
    return (
      <div className="next-company-preview">
        <div className="next-company-header">
          <span className="next-icon">📋</span>
          <span className="next-label">Siguiente Caso</span>
        </div>
        <div className="next-company-content">
          <p className="no-next-company">No hay más casos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="next-company-preview">
      <div className="next-company-header">
        <span className="next-icon">🔜</span>
        <span className="next-label">Siguiente Caso</span>
      </div>
      <div className="next-company-content">
        <div className="next-company-name">{nextCompany.name}</div>
        <div className="next-company-sector">{nextCompany.sector}</div>
        <div className="next-company-hint">
          <span className="hint-icon">💡</span>
          <span className="hint-text">Próxima empresa a investigar</span>
        </div>
      </div>
    </div>
  );
};

export default NextCompanyPreview;












