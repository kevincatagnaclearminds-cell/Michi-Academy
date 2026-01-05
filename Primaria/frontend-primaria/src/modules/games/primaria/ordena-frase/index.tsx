import { UserPhrasePage } from './pages/UserPhrasePage';
import './ordena-frase.css';

const isAdmin = () => {
  const userRole = localStorage.getItem('userRole');
  return userRole === 'admin';
};

const OrdenaFrasePage = () => {
  // Por ahora solo mostramos la vista de usuario
  // En el futuro se puede agregar AdminPhrasePage
  if (isAdmin()) {
    // TODO: Implementar AdminPhrasePage cuando sea necesario
    return <UserPhrasePage />;
  }

  return <UserPhrasePage />;
};

export default OrdenaFrasePage;




