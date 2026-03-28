import { useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Demo users for testing
  const demoUsers = [
    { email: 'Hanghai9294@gmail.com', password: 'Zxcv1234!@', name: 'ADMIN Hải' },
  ];

  useEffect(() => {
    // Check for existing session on app load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Find matching demo user
    const user = demoUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { email: user.email, name: user.name };
      const token = `token_${Date.now()}_${Math.random()}`;
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};

export default useAuth;