import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // If no keys, check localStorage for a demo session
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const demoSession = localStorage.getItem('hm_demo_session');
      if (demoSession) {
        setUser(JSON.parse(demoSession));
        setIsAuthenticated(true);
      }
      setIsLoadingAuth(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoadingAuth(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    // Mock login for demo purposes when keys are missing
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      if (email === 'admin@admin.com' || email === 'demo@admin.com') {
        const mockUser = { 
          id: 'demo-uuid',
          email, 
          role: 'admin', 
          user_metadata: { full_name: 'Dr. Hallison Matheus' } 
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('hm_demo_session', JSON.stringify(mockUser));
        return { user: mockUser };
      } else {
        throw new Error('Credenciais inválidas. Para testar o painel demo, use o e-mail demo@admin.com com qualquer senha.');
      }
    }

    // Real Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('hm_demo_session');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings: false, // Legacy support
      authError,
      authChecked: !isLoadingAuth,
      signIn,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
