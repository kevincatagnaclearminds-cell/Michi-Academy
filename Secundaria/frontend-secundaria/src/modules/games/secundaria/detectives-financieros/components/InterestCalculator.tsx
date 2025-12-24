import React, { useState } from 'react';

interface InterestCalculatorProps {
    principal: number;
    interestRate: number;
    period: number;
    onCalculate: (calculatedReturn: number) => void;
    calculatedReturn: number | null;
}

const InterestCalculator: React.FC<InterestCalculatorProps> = ({
    principal,
    interestRate,
    period,
    onCalculate,
    calculatedReturn
}) => {
    const [principalValue, setPrincipalValue] = useState<string>('');
    const [rateValue, setRateValue] = useState<string>('');
    const [periodValue, setPeriodValue] = useState<string>('');
    const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

    const handleCalculate = () => {
        const p = parseFloat(principalValue);
        const r = parseFloat(rateValue);
        const t = parseFloat(periodValue);
        
        if (!isNaN(p) && !isNaN(r) && !isNaN(t) && p > 0 && r >= 0 && t > 0) {
            // Interés Simple: Monto Final = P + (P × r × t)
            const interest = p * (r / 100) * t;
            const totalReturn = p + interest;
            setCalculatedValue(totalReturn);
            onCalculate(totalReturn);
        }
    };

    return (
        <div className="interest-calculator">
            <h3 className="calculator-title">🧮 Calculadora de Interés Simple</h3>
            <div className="calculator-formula">
                <p className="formula-main"><strong>Fórmula:</strong> Monto Final = Principal + (Principal × Tasa × Tiempo)</p>
                <p className="formula-symbolic"><strong>Monto Final = P + (P × r × t)</strong></p>
                <p className="formula-explanation">
                    Donde: P = Principal, r = Tasa de interés (%), t = Tiempo (años)
                </p>
            </div>
            
            <div className="calculator-input">
                <label className="input-section-label">Ingresa los valores desde la card:</label>
                <div className="formula-inputs">
                    <div className="input-row">
                        <label>Principal (P):</label>
                        <div className="input-group">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                value={principalValue}
                                onChange={(e) => setPrincipalValue(e.target.value)}
                                placeholder={`Ejemplo: ${principal.toLocaleString()}`}
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="input-row">
                        <label>Tasa de Interés (r):</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={rateValue}
                                onChange={(e) => setRateValue(e.target.value)}
                                placeholder={`Ejemplo: ${interestRate}`}
                                step="0.1"
                                min="0"
                            />
                            <span className="currency-symbol">%</span>
                        </div>
                    </div>
                    <div className="input-row">
                        <label>Tiempo (t):</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={periodValue}
                                onChange={(e) => setPeriodValue(e.target.value)}
                                placeholder={`Ejemplo: ${period}`}
                                step="0.1"
                                min="0"
                            />
                            <span className="currency-symbol">años</span>
                        </div>
                    </div>
                </div>
                <div className="calculator-buttons">
                    <button 
                        className="btn-calculate"
                        onClick={handleCalculate}
                        disabled={!principalValue || !rateValue || !periodValue}
                    >
                        Calcular
                    </button>
                </div>
            </div>

            {calculatedValue !== null && (
                <div className="calculation-result">
                    <p className="result-label"><strong>Monto Final Calculado:</strong></p>
                    <p className="result-value">${calculatedValue.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="result-breakdown">
                        Interés = ${parseFloat(principalValue).toLocaleString()} × {parseFloat(rateValue)}% × {parseFloat(periodValue)} = ${(parseFloat(principalValue) * (parseFloat(rateValue) / 100) * parseFloat(periodValue)).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default InterestCalculator;

