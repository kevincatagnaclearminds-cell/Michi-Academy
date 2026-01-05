import React, { useState } from 'react';
import './TextToSpeech.css';

interface TextToSpeechProps {
  text: string;
  lang?: string;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  lang = 'es-ES' 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Velocidad ligeramente más lenta para niños
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Tu navegador no soporta la función de dictado por voz.');
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="text-to-speech">
      <button
        className={`tts-btn ${isSpeaking ? 'speaking' : ''}`}
        onClick={isSpeaking ? handleStop : handleSpeak}
      >
        {isSpeaking ? '⏸ Detener' : '🔊 Escuchar frase'}
      </button>
    </div>
  );
};




