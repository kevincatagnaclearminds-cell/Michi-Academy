import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface GameItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  available: boolean;
  // Preparado para filtrado por grado (aún no activo)
  minGrade?: number;
  maxGrade?: number;
}

interface ActivitiesMenuProps {
  title: string;
  games: GameItem[];
  userGrade?: number | null;
  filterByGrade?: boolean; // Preparado para futuro, por ahora siempre false
}

export const ActivitiesMenu: React.FC<ActivitiesMenuProps> = ({ 
  title, 
  games, 
  userGrade,
  filterByGrade = false 
}) => {
  const navigate = useNavigate();

  // Filtrar juegos por grado si está activado (preparado para futuro)
  const availableGames = filterByGrade && userGrade
    ? games.filter(game => {
        if (!game.minGrade && !game.maxGrade) return true;
        if (game.minGrade && userGrade < game.minGrade) return false;
        if (game.maxGrade && userGrade > game.maxGrade) return false;
        return true;
      })
    : games.filter(game => game.available);

  const handleGameClick = (route: string) => {
    console.log('Navegando a:', route);
    try {
      navigate(route);
    } catch (error) {
      console.error('Error al navegar:', error);
    }
  };

  return (
    <div style={{ 
      padding: '50px', 
      minHeight: '100vh',
      backgroundColor: '#f4f4f4',
      color: '#040201'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          fontSize: '2.5rem',
          color: '#1a237e'
        }}>
          {title}
        </h1>

        {userGrade && (
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            color: '#1976d2'
          }}>
            <strong>Grado: {userGrade}</strong>
            {filterByGrade && (
              <span style={{ marginLeft: '10px', fontSize: '0.9rem' }}>
                (Mostrando contenido filtrado por grado)
              </span>
            )}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {availableGames.map((game) => (
            <div
              key={game.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (game.available) {
                  handleGameClick(game.route);
                }
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '25px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: game.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: game.available ? 1 : 0.6,
                border: game.available ? '2px solid transparent' : '2px solid #ccc',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                if (game.available) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#1976d2';
                }
              }}
              onMouseLeave={(e) => {
                if (game.available) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                {game.icon}
              </div>
              <h3 style={{
                margin: '0 0 10px 0',
                fontSize: '1.3rem',
                color: '#1a237e',
                textAlign: 'center'
              }}>
                {game.name}
              </h3>
              <p style={{
                margin: '0',
                color: '#666',
                fontSize: '0.95rem',
                textAlign: 'center',
                lineHeight: '1.5'
              }}>
                {game.description}
              </p>
              {!game.available && (
                <div style={{
                  marginTop: '15px',
                  padding: '8px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.85rem'
                }}>
                  Próximamente
                </div>
              )}
            </div>
          ))}
        </div>

        {availableGames.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <p>No hay juegos disponibles para tu grado actual.</p>
          </div>
        )}
      </div>
    </div>
  );
};
