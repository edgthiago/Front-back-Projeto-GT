// Contexto de autenticação integrado com o backend
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/integracaoService';

// Estados da autenticação
const authInitialState = {
  isAuthenticated: false,
  usuario: null,
  loading: true,
  error: null
};

// Actions do reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer para gerenciar estado da autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        usuario: action.payload.usuario,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        usuario: null,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        usuario: null,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        usuario: { ...state.usuario, ...action.payload }
      };

    default:
      return state;
  }
};

// Criando o contexto
const AuthContext = createContext();

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

        const isLoggedIn = authService.isLoggedIn();
        const currentUser = authService.getCurrentUser();

        if (isLoggedIn && currentUser) {
          console.log('🔍 Encontrado token e usuário:', currentUser);

          // Verificar se o token ainda é válido fazendo uma chamada para o backend
          try {
            const tokenValid = await authService.verificarToken();
            if (tokenValid && tokenValid.sucesso) {
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: { usuario: currentUser }
              });

              console.log('✅ LOGIN_SUCCESS disparado com usuário:', currentUser);

            } else {
              // Token inválido, fazer logout
              authService.logout();
              dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
          } catch {
            // Se a verificação falhar, considerar como não autenticado
            authService.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);



  // Função de login
  const login = useCallback(async (email, senha) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.login(email, senha);

      console.log('🔐 RESPONSE RECEBIDO:', response);

      if (response.sucesso) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { usuario: response.usuario }
        });
        return { sucesso: true, usuario: response.usuario };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: response.mensagem || 'Erro no login'
        });
        return { sucesso: false, mensagem: response.mensagem };
      }
    } catch (error) {
      const errorMessage = error.message || 'Erro interno no login';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      return { sucesso: false, mensagem: errorMessage };
    }
  }, []);





  // Função de registro
  const register = useCallback(async (dadosUsuario) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await authService.register(dadosUsuario);

      if (response.sucesso) {
        // Após registro bem-sucedido, fazer login automático
        if (response.token) {
          authService.setToken(response.token);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { usuario: response.usuario }
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: response.mensagem || 'Erro no registro'
        });
      }

      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro interno no registro';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage
      });
      return { sucesso: false, mensagem: errorMessage };
    }
  }, []);
  // Função de logout
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);
  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);
  // Atualizar dados do usuário
  const updateUser = useCallback((dadosAtualizados) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: dadosAtualizados
    });

    // Atualizar no localStorage também
    const usuarioAtual = authService.getCurrentUser();
    if (usuarioAtual) {
      const usuarioAtualizado = { ...usuarioAtual, ...dadosAtualizados };
      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    }
  }, []);
  // Verificar se usuário tem permissão
  const hasPermission = useCallback((permissao) => {
    if (!state.usuario) return false;

    const { tipo_usuario, permissoes } = state.usuario;

    // Admin tem todas as permissões
    if (tipo_usuario === 'admin') return true;

    // Verificar permissões específicas
    if (permissoes && Array.isArray(permissoes)) {
      return permissoes.includes(permissao);
    }

    return false;
  }, [state.usuario]);
  // Verificar se é admin
  const isAdmin = useCallback(() => {
    return state.usuario?.tipo_usuario === 'admin';
  }, [state.usuario]);

  // Verificar se é cliente
  const isCliente = useCallback(() => {
    return state.usuario?.tipo_usuario === 'cliente';
  }, [state.usuario]);

  const value = {
    // Estado
    ...state,

    // Ações
    login,
    register,
    logout,
    clearError,
    updateUser,

    // Utilitários
    hasPermission,
    isAdmin,
    isCliente
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

// HOC para proteger rotas
export const withAuth = (Component, requiredPermission = null) => {
  return (props) => {
    const { isAuthenticated, hasPermission, loading } = useAuth();

    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="alert alert-warning text-center">
          <h5>Acesso negado</h5>
          <p>Você precisa estar logado para acessar esta página.</p>
        </div>
      );
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="alert alert-danger text-center">
          <h5>Permissão insuficiente</h5>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
