import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';

/**
 * Componente de rutas principal de la aplicación
 * Aquí se definen todas las rutas del frontend usando React Router
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Ruta por defecto - redirige a login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* TODO: Agregar más rutas aquí cuando estén disponibles */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
