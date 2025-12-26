import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MichilandiaNinosPage from './modules/games/primaria/michilandia-ninos';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal redirige a MichiLandia */}
        <Route path="/" element={<Navigate to="/michilandia" replace />} />
        
        {/* Ruta del juego MichiLandia */}
        <Route path="/michilandia" element={<MichilandiaNinosPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


