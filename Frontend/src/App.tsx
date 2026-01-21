import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Login compartido
import { LoginPage } from '@shared/auth/pages/LoginPage';

// Componentes de Primaria
import { ActivitiesPage as PrimariaActivitiesPage } from '@primaria/modules/activities/pages/ActivitiesPage';
import { Navbar as PrimariaNavbar } from '@primaria/shared/components/layout/Navbar';
import { ProtectedRoute } from '@shared/components/ProtectedRoute';

// Juegos de Primaria
import VideosPrimariaPage from '@primaria/modules/games/primaria/videos';
import FabulasPage from '@primaria/modules/games/primaria/fabulas';
import QuizIndividualPrimariaPage from '@primaria/modules/games/primaria/quiz-individual';
import OrdenaFrasePage from '@primaria/modules/games/primaria/ordena-frase';
import MichilandiaNinosPage from '@primaria/modules/games/primaria/michilandia-ninos';
import MichiAventuraNinosPage from '@primaria/modules/games/primaria/michiaventura-ninos';
import ColorearPage from '@primaria/modules/games/primaria/colorear';
import RompecabezasPage from '@primaria/modules/games/primaria/rompecabezas';
import OrdenaCancionPage from '@primaria/modules/games/primaria/ordena-cancion';
import KahootPrimariaPage from '@primaria/modules/games/primaria/kahoot';

// Componentes de Secundaria
import { ActivitiesPage as SecundariaActivitiesPage } from '@secundaria/modules/activities/pages/ActivitiesPage';
import { Navbar as SecundariaNavbar } from '@secundaria/shared/components/layout/Navbar';

// Juegos de Secundaria
import VideosSecundariaPage from '@secundaria/modules/games/secundaria/videos';
import DetectivesFinancierosPage from '@secundaria/modules/games/secundaria/detectives-financieros';
import QuizIndividualSecundariaPage from '@secundaria/modules/games/secundaria/quiz-individual';
import JuegoBolsaPage from '@secundaria/modules/games/secundaria/juego-bolsa';
import MichilandiaSecundariaPage from '@secundaria/modules/games/secundaria/michilandia';
import MichiAventuraSecundariaPage from '@secundaria/modules/games/secundaria/michiaventura';
import PackmanFinancieroPage from '@secundaria/modules/games/secundaria/packman';
import KahootSecundariaPage from '@secundaria/modules/games/secundaria/kahoot';

// Componentes de Admin
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminNavbar } from './admin/components/AdminNavbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Ruta raíz - redirigir a primaria por defecto */}
          <Route path="/" element={<Navigate to="/primaria/login" replace />} />

          {/* Rutas de Login (compartido) */}
          <Route path="/primaria/login" element={<LoginPage />} />
          <Route path="/secundaria/login" element={<LoginPage />} />

          {/* Rutas de Primaria */}
          <Route
            path="/primaria/activities"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <PrimariaActivitiesPage />
              </ProtectedRoute>
            }
          />

          {/* Juegos de Primaria */}
          <Route
            path="/primaria/games/videos"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <VideosPrimariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/fabulas"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <FabulasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/quiz-individual"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <QuizIndividualPrimariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/ordena-frase"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <OrdenaFrasePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/michilandia-ninos"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <MichilandiaNinosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/michiaventura-ninos"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <MichiAventuraNinosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/colorear"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <ColorearPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/rompecabezas"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <RompecabezasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/ordena-cancion"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <OrdenaCancionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/primaria/games/kahoot"
            element={
              <ProtectedRoute>
                <PrimariaNavbar />
                <KahootPrimariaPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Secundaria */}
          <Route
            path="/secundaria/activities"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <SecundariaActivitiesPage />
              </ProtectedRoute>
            }
          />

          {/* Juegos de Secundaria */}
          <Route
            path="/secundaria/games/videos"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <VideosSecundariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/detectives-financieros"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <DetectivesFinancierosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/quiz-individual"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <QuizIndividualSecundariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/juego-bolsa"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <JuegoBolsaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/michilandia"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <MichilandiaSecundariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/michiaventura"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <MichiAventuraSecundariaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/packman"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <PackmanFinancieroPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/secundaria/games/kahoot"
            element={
              <ProtectedRoute>
                <SecundariaNavbar />
                <KahootSecundariaPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas de Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminNavbar />
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Ruta catch-all - redirigir a primaria/login */}
          <Route path="*" element={<Navigate to="/primaria/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
