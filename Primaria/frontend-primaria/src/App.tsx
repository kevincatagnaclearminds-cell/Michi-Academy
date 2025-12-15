import React from 'react';
//import { LoginPage } from './modules/auth/pages/LoginPage';
//import VideosPrimariaPage from './modules/games/primaria/videos';
import { UserVideosPage } from './modules/games/primaria/videos/pages/UserVideosPage';

const App: React.FC = () => {
  return (
    <div className="app">
      <UserVideosPage />
    </div>
  );
};

export default App;


