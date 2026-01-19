import React from 'react';
import { Company } from '../types';

interface CompanyCardProps {
    company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ 
    company
}) => {
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Bajo': return '#2ecc71'; // Green
            case 'Medio': return '#f1c40f'; // Yellow
            case 'Alto': return '#e74c3c'; // Red
            default: return '#95a5a6';
        }
    };

    return (
        <div className="detective-card">
            <div className="detective-card-header">
                <span className="folder-tab">EXPEDIENTE #{company.id}</span>
            </div>
            <div className="detective-card-content">
                <h2 className="company-name">{company.name}</h2>
                <div className="company-sector">{company.sector}</div>

                <div className="company-details">
                    <p className="description">{company.description}</p>

                    <div className="stats-grid">
                        <div className="stat-box">
                            <label>Tasa de Interés</label>
                            <div className="stat-value interest">{company.interestRate}%</div>
                        </div>
                        <div className="stat-box">
                            <label>Nivel de Riesgo</label>
                            <div
                                className="stat-value risk-badge"
                                style={{ backgroundColor: getRiskColor(company.riskLevel) }}
                            >
                                {company.riskLevel}
                            </div>
                        </div>
                        <div className="stat-box">
                            <label>Monto de Inversión</label>
                            <div className="stat-value investment">${company.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div className="stat-box">
                            <label>Período</label>
                            <div className="stat-value period">{company.investmentPeriod} año{company.investmentPeriod !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
