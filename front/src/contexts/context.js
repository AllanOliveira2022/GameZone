// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api'; // Importando a instância do axios

// Criando o contexto
const AuthContext = createContext(null);

// Criando o Provider do contexto
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ao carregar, verifica se existe um usuário no localStorage
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Configura o token para todas as requisições
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Busca os dados do usuário atual
          try {
            const response = await api.get('/auth/me');
            setCurrentUser(response.data.user);
          } catch (err) {
            // Se não conseguir buscar o usuário, provavelmente o token expirou
            console.error('Erro ao buscar dados do usuário:', err);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Função para realizar login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      
      // Salva o token no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('name', user.name);
      
      // Configura o token para todas as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Atualiza o estado do usuário
      setCurrentUser(user);
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para registro de novo usuário
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Salva o token no localStorage
      localStorage.setItem('token', token);
      
      // Configura o token para todas as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Atualiza o estado do usuário
      setCurrentUser(user);
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao registrar:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao registrar. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    
    // Remove o cabeçalho de autorização
    delete api.defaults.headers.common['Authorization'];
    
    // Limpa o usuário do estado
    setCurrentUser(null);
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put('/users/profile', userData);
      setCurrentUser(response.data.user);
      
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Valores que serão disponibilizados pelo contexto
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth() {
  return useContext(AuthContext);
}