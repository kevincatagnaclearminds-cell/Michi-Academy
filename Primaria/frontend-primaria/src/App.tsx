import React from 'react';
//import { LoginPage } from './modules/auth/pages/LoginPage';

import OrdenaFrasePage from './modules/games/primaria/ordena-frase';
//import { UserVideosPage } from './modules/games/primaria/videos/pages/UserVideosPage';
//import {UserFabulasPage} from './modules/games/primaria/fabulas/pages/UserFabulasPage';



const App: React.FC = () => {
  return (
    <div className="app">
      <OrdenaFrasePage />
    </div>
  );
};

export default App;


