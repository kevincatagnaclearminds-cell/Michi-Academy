import React, { useState, useEffect } from "react";
import "./CartaNegocio.css";

// Importar todas las cartas de negocios
import cartaCarniceria from "../assets/negocios/Tarjeta_Michipolio_Carniceria.jpg";
import cartaCelulares from "../assets/negocios/Tarjeta_Michipolio_Celulares.jpg";
import cartaComidaRapida from "../assets/negocios/Tarjeta_Michipolio_Comida_Rapida.jpg";
import cartaFarmacia from "../assets/negocios/Tarjeta_Michipolio_Farmacia.jpg";
import cartaFerreteria from "../assets/negocios/Tarjeta_Michipolio_Ferreteria.jpg";
import cartaFruteria from "../assets/negocios/Tarjeta_Michipolio_Fruteria.jpg";
import cartaGranos from "../assets/negocios/Tarjeta_Michipolio_Granos_y_Cereales.jpg";
import cartaHeladeria from "../assets/negocios/Tarjeta_Michipolio_Heladeria.jpg";
import cartaJugueteria from "../assets/negocios/Tarjeta_Michipolio_Jugueteria.jpg";
import cartaMarisqueria from "../assets/negocios/Tarjeta_Michipolio_Marisqueria.jpg";
import cartaPanaderia from "../assets/negocios/Tarjeta_Michipolio_Panaderia.jpg";
import cartaPapeleria from "../assets/negocios/Tarjeta_Michipolio_Papeleria.jpg";
import cartaPizzeria from "../assets/negocios/Tarjeta_Michipolio_Pizzeria.jpg";
import cartaTecnologia from "../assets/negocios/Tarjetas_Michipolio_Tecnologia.jpg";
import cartaMascotas from "../assets/negocios/Tarjeta_Michipolio_Tienda_de_Mascotas.jpg";
import cartaRopa from "../assets/negocios/Tarjeta_Michipolio_Tienda_de_Ropa.jpg";
import cartaTrasera from "../assets/negocios/Tarjeta_Michipolio_Parte_Trasera.jpg";

// Mapa de negocios a sus imágenes
export const CARTAS_NEGOCIOS: { [key: string]: string } = {
  carniceria: cartaCarniceria,
  celulares: cartaCelulares,
  comida_rapida: cartaComidaRapida,
  farmacia: cartaFarmacia,
  ferreteria: cartaFerreteria,
  fruteria: cartaFruteria,
  granos: cartaGranos,
  heladeria: cartaHeladeria,
  jugueteria: cartaJugueteria,
  marisqueria: cartaMarisqueria,
  panaderia: cartaPanaderia,
  papeleria: cartaPapeleria,
  pizzeria: cartaPizzeria,
  tecnologia: cartaTecnologia,
  mascotas: cartaMascotas,
  ropa: cartaRopa,
};

export const CARTA_TRASERA = cartaTrasera;

interface CartaNegocioProps {
  negocioId: string;
  revelada?: boolean;
  onRevelar?: () => void;
  comprada?: boolean;
  precio?: number;
  size?: "small" | "medium" | "large";
}

const CartaNegocio: React.FC<CartaNegocioProps> = ({
  negocioId,
  revelada = false,
  onRevelar,
  comprada = false,
  precio,
  size = "medium",
}) => {
  const [isFlipped, setIsFlipped] = useState(revelada);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (revelada && !isFlipped) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsFlipped(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }, 300);
    }
  }, [revelada, isFlipped]);

  const handleClick = () => {
    if (!isFlipped && !isAnimating && onRevelar) {
      onRevelar();
    }
  };

  const cartaFrente = CARTAS_NEGOCIOS[negocioId] || cartaTrasera;

  return (
    <div
      className={`carta-negocio carta-${size} ${
        isFlipped ? "carta-flipped" : ""
      } ${isAnimating ? "carta-animating" : ""} ${
        comprada ? "carta-comprada" : ""
      }`}
      onClick={handleClick}
    >
      <div className="carta-inner">
        {/* Parte trasera */}
        <div className="carta-face carta-back">
          <img src={cartaTrasera} alt="Carta" />
          {!comprada && (
            <div className="carta-hover-text">Click para revelar</div>
          )}
        </div>

        {/* Parte frontal */}
        <div className="carta-face carta-front">
          <img src={cartaFrente} alt={negocioId} />
          {comprada && (
            <div className="carta-owned-badge">
              <span>✓ COMPRADA</span>
            </div>
          )}
          {precio !== undefined && !comprada && (
            <div className="carta-precio">
              <span>💰 ${precio}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartaNegocio;
