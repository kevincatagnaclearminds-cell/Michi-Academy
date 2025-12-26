import React from 'react';
import './GameHeader.css';

interface GameHeaderProps {
    lives: number;
    casosResueltos: number;
    capital: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ lives, casosResueltos, capital }) => {
    const getCapitalColor = () => {
        if (capital > 100000) return '#27ae60'; // Verde para ganancias
        if (capital < 100000) return '#e74c3c'; // Rojo para pérdidas
        return '#f39c12'; // Amarillo para neutral
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const capitalChange = capital - 100000; // Capital inicial es 100,000
    const isPositive = capitalChange >= 0;

    return (
        <div className="game-header-container">
            <div className="game-header-content">
                <div className="header-stat header-lives">
                    <div className="stat-icon">💖</div>
                    <div className="stat-info">
                        <div className="stat-label">Vidas</div>
                        <div className="stat-value">
                            {Array.from({ length: 3 }, (_, i) => (
                                <span 
                                    key={i} 
                                    className={`heart-icon ${i < lives ? 'active' : 'inactive'}`}
                                >
                                    ❤️
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="header-stat header-cases">
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <div className="stat-label">Casos Resueltos</div>
                        <div className="stat-value">{casosResueltos}</div>
                    </div>
                </div>

                <div className="header-stat header-capital">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <div className="stat-label">Capital</div>
                        <div 
                            className="stat-value capital-value"
                            style={{ color: getCapitalColor() }}
                        >
                            {formatCurrency(capital)}
                            {capitalChange !== 0 && (
                                <span className={`capital-change ${isPositive ? 'positive' : 'negative'}`}>
                                    {isPositive ? '+' : ''}{formatCurrency(capitalChange)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameHeader;




