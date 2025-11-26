import React from 'react';
import AppRoutes from './routes';

/**
 * Componente raíz de la aplicación
 * Este es el componente principal que envuelve toda la aplicación
 */
const App: React.FC = () => {
  return (
    <div className="app" style={{ width: '100%', height: '100vh' }}>
      {/* Aquí se renderizan las rutas de la aplicación */}
      <AppRoutes />
    </div>
  );
};

export default App;
