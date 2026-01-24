import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import type { JSX } from 'react/jsx-runtime';

interface PrivateRouteProps {
  children: JSX.Element;
  perfil?: string | string[];
}

const PrivateRoute = ({ children, perfil }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (perfil) {
    const perfis = Array.isArray(perfil) ? perfil : [perfil];
    if (!perfis.includes(user.perfil)) {
      return <div className="flex justify-center items-center h-screen text-red-600 font-bold">Acesso negado</div>;
    }
  }
  return children;
};

export default PrivateRoute; 