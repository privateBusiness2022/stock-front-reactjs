import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setRole, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  userData: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, userData } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      userData,
    };
  },
  LOGIN: (state, action) => {
    const { userData } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      userData,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    userData: null,
  }),
  REGISTER: (state, action) => {
    const { userData } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      userData,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const id = window.localStorage.getItem('id');
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get(`/users/${id}`);

          const userData = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              userData,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              userData: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            userData: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });

    const { accessToken, userData } = response.data;

    window.localStorage.setItem('id', userData.id);
    setSession(accessToken);
    setRole(userData.role);
    dispatch({
      type: 'LOGIN',
      payload: {
        userData,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, userData } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        userData,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
