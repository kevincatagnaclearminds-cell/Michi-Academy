import { UserVideosPage } from './pages/UserVideosPage';
import { AdminVideosPage } from './pages/AdminVideosPage';
import './videos.css';

// TODO: Reemplazar con lógica real de roles cuando esté implementada
const isAdmin = () => {
  // Temporal: verificar si el usuario es admin
  // Por ahora, puedes usar localStorage o un prop
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};

const VideosPrimariaPage = () => {
  // Decidir qué vista mostrar según el rol
  if (isAdmin()) {
    return <AdminVideosPage />;
  }

  return <UserVideosPage />;
};

export default VideosPrimariaPage;
