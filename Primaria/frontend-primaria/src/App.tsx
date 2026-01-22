import React from 'react';
//import { LoginPage } from './modules/auth/pages/LoginPage';

//import OrdenaFrasePage from './modules/games/primaria/ordena-frase';

import { AdminVideosPage } from './modules/games/primaria/videos/pages/AdminVideosPage';
import { UserVideosPage } from './modules/games/primaria/videos/pages/UserVideosPage';
//import {UserFabulasPage} from './modules/games/primaria/fabulas/pages/UserFabulasPage';
import DetectivesFinancierosPage from '../../../Secundaria/frontend-secundaria/src/modules/games/secundaria/detectives-financieros'


const App: React.FC = () => {
  return (
    <div className="app">
      <DetectivesFinancierosPage />
    </div>
  );
};

export default App;


