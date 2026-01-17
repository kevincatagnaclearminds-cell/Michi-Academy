import React from 'react';

// Importar uno de los mÃ³dulos de Secundaria como ejemplo
// Puedes cambiar esto por el mÃ³dulo que desees mostrar
import { UserVideosPage } from './modules/games/secundaria/videos/pages/UserVideosPage';

const App: React.FC = () => {
  return (
    <div className="app">
      <UserVideosPage />
    </div>
  );
};

export default App;
