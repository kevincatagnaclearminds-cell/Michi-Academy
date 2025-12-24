import React from 'react';

interface FeedbackProps {
    show: boolean;
    isCorrect: boolean;
    message: string;
    onNext: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ show, isCorrect, message, onNext }) => {
    if (!show) return null;

    const renderMessageLine = (line: string, index: number) => {
        // Detectar líneas de separador
        if (line.startsWith('━━')) {
            return <hr key={index} className="feedback-separator" />;
        }
        
        // Detectar títulos de sección (con emoji y mayúsculas)
        if (line.match(/^[📊📚🧮📋⚠️].*:$/)) {
            return (
                <h4 key={index} className="feedback-section-title">
                    {line}
                </h4>
            );
        }
        
        // Detectar líneas con "Tu respuesta" o "Respuesta correcta"
        if (line.includes('Tu respuesta:') || line.includes('Respuesta correcta:')) {
            const isCorrect = line.includes('Respuesta correcta:');
            return (
                <p key={index} className={`feedback-detail-line ${isCorrect ? 'correct-answer' : 'user-answer'}`}>
                    {line}
                </p>
            );
        }
        
        // Líneas normales
        return (
            <p key={index} className="feedback-line">
                {line}
            </p>
        );
    };

    return (
        <div className="feedback-overlay">
            <div className={`feedback-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="feedback-icon">
                    {isCorrect ? '✅' : '⚠️'}
                </div>
                <h3>{isCorrect ? '¡Excelente Deducción!' : '¡Cuidado Detective!'}</h3>
                <div className="feedback-content">
                    {message.split('\n').map((line, index) => renderMessageLine(line, index))}
                </div>
                <button className="btn-next" onClick={onNext}>
                    Siguiente Caso ➡️
                </button>
            </div>
        </div>
    );
};

export default Feedback;
