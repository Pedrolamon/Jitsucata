import { createContext, useContext, useState, useEffect  } from 'react';
import type {ReactNode } from 'react';
import api from '../services/api';
import type { Fornecedor } from '../types/fornecedor';


interface User {
  id: string;
  name: string;
  email: string;
  perfil: 'admin' | 'fornecedor';
}

type FornecedorInput = Omit<Fornecedor, 'id' | 'criadoEm'>& {
  password: string; 
  perfil: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  register: (userData: FornecedorInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, senha: password });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
    } finally {
      setLoading(false);
    }
  };
 const register = async (userData: FornecedorInput) => {
    try {
      await api.post('/register', userData); 
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 