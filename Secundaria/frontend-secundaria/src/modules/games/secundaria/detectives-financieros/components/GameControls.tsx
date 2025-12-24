import React from 'react';

interface GameControlsProps {
    onInvest: () => void;
    onReject: () => void;
    disabled: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onInvest, onReject, disabled }) => {
    return (
        <div className="game-controls">
            <button
                className="btn-control btn-reject"
                onClick={onReject}
                disabled={disabled}
            >
                <span className="icon">❌</span> RECHAZAR
                <span className="sub-text">Alto Riesgo / Bajo Retorno</span>
            </button>

            <button
                className="btn-control btn-invest"
                onClick={onInvest}
                disabled={disabled}
            >
                <span className="icon">💼</span> INVERTIR
                <span className="sub-text">Factible / Buen Retorno</span>
            </button>
        </div>
    );
};

export default GameControls;
