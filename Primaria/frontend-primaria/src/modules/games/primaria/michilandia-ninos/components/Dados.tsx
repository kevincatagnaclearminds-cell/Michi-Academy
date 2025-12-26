import React, { useState } from "react";
import "./Dados.css";

interface DadoProps {
  onTirar: (resultado: number) => void;
  disabled?: boolean;
}

const CARAS_DADO: { [key: number]: string } = {
  1: "⚀",
  2: "⚁",
  3: "⚂",
  4: "⚃",
  5: "⚄",
  6: "⚅",
};

const Dado: React.FC<DadoProps> = ({ onTirar, disabled = false }) => {
  const [dado, setDado] = useState<number>(1);
  const [tirando, setTirando] = useState(false);

  const tirarDado = () => {
    if (disabled || tirando) return;

    setTirando(true);

    // Animación de tirar dado
    let contador = 0;
    const intervalo = setInterval(() => {
      const valorDado = Math.floor(Math.random() * 6) + 1;
      setDado(valorDado);
      contador++;

      if (contador >= 10) {
        clearInterval(intervalo);
        const resultadoFinal = Math.floor(Math.random() * 6) + 1;
        setDado(resultadoFinal);
        setTirando(false);
        onTirar(resultadoFinal);
      }
    }, 100);
  };

  // Función para tirar con valor específico (pruebas)
  const tirarConValor = (valor: number) => {
    if (disabled || tirando) return;
    setDado(valor);
    onTirar(valor);
  };

  return (
    <div className="dados-container">
      {/* Lado izquierdo - Dado */}
      <div className="dados-wrapper">
        <div className={`dado ${tirando ? "dado-tirando" : ""}`}>
          <span className="dado-cara">{CARAS_DADO[dado]}</span>
        </div>
      </div>

      {/* Lado derecho - Resultado y Botón */}
      <div className="dados-acciones">
        <div className="dados-resultado">
          <span className="dados-total">Resultado: {dado}</span>
        </div>

        <button
          className={`dados-boton ${tirando ? "dados-boton-tirando" : ""}`}
          onClick={tirarDado}
          disabled={disabled || tirando}
        >
          {tirando ? "🎲 Tirando..." : "🎲 ¡Tirar!"}
        </button>

        {/* Botones de prueba */}
        <div className="dados-prueba">
          <button
            className="btn-prueba"
            onClick={() => tirarConValor(3)}
            disabled={disabled || tirando}
            title="Tirar 3 (prueba)"
          >
            🎯 3
          </button>
          <button
            className="btn-prueba"
            onClick={() => tirarConValor(6)}
            disabled={disabled || tirando}
            title="Tirar 6 (prueba)"
          >
            🎯 6
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dado;
