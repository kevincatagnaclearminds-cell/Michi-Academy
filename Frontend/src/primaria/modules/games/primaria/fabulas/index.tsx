import { UserFabulasPage } from './pages/UserFabulasPage';
import './fabulas.css';

// TODO: Reemplazar con lógica real de roles cuando esté implementada
const isAdmin = () => {
  // Temporal: verificar si el usuario es admin
  // Por ahora, puedes usar localStorage o un prop
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};

const FabulasPage = () => {
  // Por ahora solo mostramos la vista de usuario
  // En el futuro se puede agregar AdminFabulasPage
  if (isAdmin()) {
    // TODO: Implementar AdminFabulasPage cuando sea necesario
    return <UserFabulasPage />;
  }

  return <UserFabulasPage />;
};

export default FabulasPage;


